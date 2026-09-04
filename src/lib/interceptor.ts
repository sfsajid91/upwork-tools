import { type JobInsights, normalizeJobInsights } from './insights';
import { jobIdFromPageUrl, normalizeJobId } from './job-page';
import { logger } from './logger';
import { createPageEvent, isPageReplayRequest } from './protocol';

const JOB_DETAILS_ALIASES = [
  'gql-query-get-auth-job-details-v2',
  'gql-query-get-visitor-job-details',
] as const;
const INSTALL_FLAG = '__UPWORK_TOOLS_INTERCEPTOR__';
const TARGET_MARKERS = [
  'jobAuthDetails',
  'jobPubDetails',
  'totalApplicants',
  ...JOB_DETAILS_ALIASES,
];

type InterceptedWindow = Window & {
  [INSTALL_FLAG]?: boolean;
  _authOrigFetch?: unknown;
};

type LatestCapture = {
  jobId: string;
  insights: JobInsights;
  capturedAt: number;
};

let previousCapture: { signature: string; capturedAt: number } | null = null;
let latestCapture: LatestCapture | null = null;

function isSupportedUrl(value: string): boolean {
  if (typeof value !== 'string' || value.trim() === '') return false;
  try {
    const url = new URL(value, window.location.href);
    const isUpwork = url.hostname === 'upwork.com' || url.hostname.endsWith('.upwork.com');
    return (
      isUpwork &&
      JOB_DETAILS_ALIASES.includes(
        url.searchParams.get('alias') as (typeof JOB_DETAILS_ALIASES)[number],
      )
    );
  } catch {
    return false;
  }
}
function isSupportedPageContext(): boolean {
  return jobIdFromPageUrl(window.location.href) !== null;
}

function requestUrl(input: unknown): string | null {
  try {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.href;
    if (input instanceof Request) return input.url;
    return null;
  } catch {
    return null;
  }
}

function emitInsights(insights: JobInsights): void {
  const signature = JSON.stringify(insights);
  const now = Date.now();
  if (
    previousCapture &&
    previousCapture.signature === signature &&
    now - previousCapture.capturedAt < 1000
  ) {
    return;
  }
  previousCapture = { signature, capturedAt: now };
  const jobId = normalizeJobId(insights.job.id);
  if (jobId) latestCapture = { jobId, insights, capturedAt: now };
  window.postMessage(createPageEvent(insights), window.location.origin);
}

function installReplayListener(): void {
  try {
    window.addEventListener('message', (event: MessageEvent<unknown>) => {
      try {
        if (
          event.source !== window ||
          event.origin !== window.location.origin ||
          !isPageReplayRequest(event.data) ||
          !latestCapture ||
          jobIdFromPageUrl(window.location.href) !== latestCapture.jobId
        ) {
          return;
        }
        window.postMessage(
          createPageEvent(latestCapture.insights, {
            requestId: event.data.requestId,
            capturedAt: latestCapture.capturedAt,
          }),
          window.location.origin,
        );
      } catch {
        // Replay must never affect the host page.
      }
    });
  } catch {
    // Replay is optional when the page event API is unavailable.
  }
}

function inspectPayload(payload: unknown, url: string | null): void {
  try {
    if (url === null) {
      const pageJobId = jobIdFromPageUrl(window.location.href);
      if (!pageJobId) return;
      const insights = normalizeJobInsights(payload);
      if (!insights) return;
      const payloadJobId = normalizeJobId(insights.job.id);
      if (!payloadJobId || pageJobId !== payloadJobId) return;
      emitInsights(insights);
      return;
    }
    if (!isSupportedUrl(url)) return;
    const insights = normalizeJobInsights(payload);
    if (insights) emitInsights(insights);
  } catch {
    // Inspection must never affect the host page.
  }
}

/**
 * Installs an inspection hook as an accessor so later page-side reassignment is
 * transparently re-wrapped: capture survives tampering while the page keeps
 * running whatever function it installs.
 */
function defendInspectionHook(
  owner: object,
  key: string,
  wrapValue: (current: unknown) => unknown,
): void {
  let current: unknown;
  try {
    current = Reflect.get(owner, key);
    const descriptor = Object.getOwnPropertyDescriptor(owner, key);
    current = wrapValue(current);
    if (descriptor && !descriptor.configurable) {
      (owner as Record<string, unknown>)[key] = current;
      return;
    }
    Object.defineProperty(owner, key, {
      configurable: true,
      enumerable: descriptor?.enumerable ?? true,
      get: () => current,
      set: (value: unknown) => {
        current = value === current ? value : wrapValue(value);
      },
    });
  } catch {
    try {
      (owner as Record<string, unknown>)[key] = current;
    } catch {
      // Inspection must never affect the host page.
    }
  }
}

function installFetchAndResponseHooks(page: InterceptedWindow): void {
  const nativeJson = Response.prototype.json;
  const nativeParse = JSON.parse;

  const inspectResponse = async (url: string, response: Response): Promise<void> => {
    if (!isSupportedUrl(url)) return;
    try {
      inspectPayload(await nativeJson.call(response.clone()), url);
    } catch {
      // Inspection must never affect the host page.
    }
  };

  const wrappedFetches = new WeakSet<typeof window.fetch>();
  const wrapFetch = (original: typeof window.fetch): typeof window.fetch => {
    if (wrappedFetches.has(original)) return original;
    const wrapped: typeof window.fetch = function (this: Window, ...args) {
      const url = requestUrl(args[0]);
      if (url !== null && isSupportedUrl(url)) {
        logger.log('Found URL:', url);
      }
      const result = original.apply(this, args);
      if (url !== null) {
        void result
          .then((response) => inspectResponse(url, response))
          .catch(() => {
            // Inspection must never affect the host page.
          });
      }
      return result;
    };
    wrappedFetches.add(original);
    wrappedFetches.add(wrapped);
    return wrapped;
  };

  defendInspectionHook(page, 'fetch', (current) =>
    typeof current === 'function' && !wrappedFetches.has(current as typeof window.fetch)
      ? wrapFetch(current as typeof window.fetch)
      : current,
  );

  try {
    const descriptor = Object.getOwnPropertyDescriptor(page, '_authOrigFetch');
    if (!descriptor || descriptor.configurable) {
      const wrapAuthFetch = (value: unknown): unknown => {
        if (typeof value === 'function') return wrapFetch(value as typeof window.fetch);
        if (value && typeof (value as PromiseLike<unknown>).then === 'function') {
          return (value as PromiseLike<unknown>).then(wrapAuthFetch);
        }
        return value;
      };
      let authFetch = wrapAuthFetch(page._authOrigFetch);
      Object.defineProperty(page, '_authOrigFetch', {
        configurable: true,
        enumerable: descriptor?.enumerable ?? true,
        get: () => authFetch,
        set: (value: unknown) => {
          authFetch = wrapAuthFetch(value);
        },
      });
    }
  } catch {
    // Optional Upwork internals are not required for capture.
  }

  const wrapJsonParse =
    (original: typeof JSON.parse): typeof JSON.parse =>
    (...args) => {
      const payload = original.apply(JSON, args);
      const text = args[0];
      if (
        typeof text === 'string' &&
        TARGET_MARKERS.some((marker) => text.includes(marker)) &&
        isSupportedPageContext()
      ) {
        inspectPayload(payload, null);
      }
      return payload;
    };
  defendInspectionHook(JSON, 'parse', (current) =>
    typeof current === 'function' ? wrapJsonParse(current as typeof JSON.parse) : current,
  );

  const wrapResponseJson = (original: Response['json']): Response['json'] =>
    function (this: Response, ...args) {
      const result = original.apply(this, args);
      void result
        .then((payload) => {
          inspectPayload(payload, this.url);
        })
        .catch(() => {
          // Inspection must never affect the host page.
        });
      return result;
    };
  defendInspectionHook(Response.prototype, 'json', (current) =>
    typeof current === 'function' ? wrapResponseJson(current as Response['json']) : current,
  );

  const wrapResponseText = (original: Response['text']): Response['text'] =>
    function (this: Response, ...args) {
      const result = original.apply(this, args);
      void result
        .then(async (text) => {
          if (TARGET_MARKERS.some((marker) => text.includes(marker))) {
            try {
              inspectPayload(nativeParse(text), this.url);
            } catch {
              // Ignore marker-containing non-JSON text.
            }
          }
        })
        .catch(() => {
          // Inspection must never affect the host page.
        });
      return result;
    };
  defendInspectionHook(Response.prototype, 'text', (current) =>
    typeof current === 'function' ? wrapResponseText(current as Response['text']) : current,
  );
}
function installXhrHooks(): void {
  const urls = new WeakMap<XMLHttpRequest, string>();
  defendInspectionHook(XMLHttpRequest.prototype, 'open', (current) => {
    if (typeof current !== 'function') return current;
    const original = current as unknown as (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null,
    ) => void;
    return function (this: XMLHttpRequest, ...args: Parameters<typeof original>) {
      const url = String(args[1]);
      urls.set(this, url);
      if (isSupportedUrl(url)) {
        logger.log('Found URL:', url);
      }
      original.apply(this, args);
    } as typeof XMLHttpRequest.prototype.open;
  });
  defendInspectionHook(XMLHttpRequest.prototype, 'send', (current) => {
    if (typeof current !== 'function') return current;
    const original = current as unknown as XMLHttpRequest['send'];
    return function (this: XMLHttpRequest, ...args: Parameters<XMLHttpRequest['send']>) {
      this.addEventListener(
        'load',
        () => {
          try {
            const url = urls.get(this) ?? this.responseURL;
            if (!isSupportedUrl(url)) return;
            const payload =
              this.responseType === 'json' ? this.response : JSON.parse(this.responseText);
            inspectPayload(payload, url);
          } catch {
            // Inspection must never affect the host page.
          }
        },
        { once: true },
      );
      return original.apply(this, args);
    } as typeof XMLHttpRequest.prototype.send;
  });
}

export function installInterceptors(): void {
  const page = window as InterceptedWindow;
  if (page[INSTALL_FLAG]) return;
  page[INSTALL_FLAG] = true;
  logger.log('Interceptor initiated');
  installReplayListener();
  try {
    installFetchAndResponseHooks(page);
  } catch {
    // A browser-specific hook can fail without affecting the page.
  }
  try {
    installXhrHooks();
  } catch {
    // A browser-specific hook can fail without affecting the page.
  }
}
