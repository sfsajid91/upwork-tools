import { normalizeJobInsights, type JobInsights } from './insights';
import { createPageEvent } from './protocol';

const JOB_DETAILS_ALIAS = 'gql-query-get-auth-job-details-v2';
const INSTALL_FLAG = '__UPWORK_TOOLS_INTERCEPTOR__';
const TARGET_MARKERS = ['jobAuthDetails', 'totalApplicants', JOB_DETAILS_ALIAS];

type InterceptedWindow = Window & {
  [INSTALL_FLAG]?: boolean;
  _authOrigFetch?: unknown;
};

let previousCapture: { signature: string; capturedAt: number } | null = null;

function isSupportedUrl(value: string): boolean {
  try {
    const url = new URL(value, window.location.href);
    const isUpwork =
      url.hostname === 'upwork.com' || url.hostname.endsWith('.upwork.com');
    return isUpwork && url.searchParams.get('alias') === JOB_DETAILS_ALIAS;
  } catch {
    return false;
  }
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
  const signature = JSON.stringify([
    insights.job.id,
    insights.job.title,
    insights.activity.exactProposals,
  ]);
  const now = Date.now();
  if (previousCapture && previousCapture.signature === signature && now - previousCapture.capturedAt < 1000) {
    return;
  }
  previousCapture = { signature, capturedAt: now };
  window.postMessage(createPageEvent(insights), window.location.origin);
}

function inspectPayload(payload: unknown, url?: string): void {
  try {
    if (url !== undefined && !isSupportedUrl(url)) return;
    const insights = normalizeJobInsights(payload);
    if (insights) emitInsights(insights);
  } catch {
    // Inspection must never affect the host page.
  }
}

function installFetchAndResponseHooks(page: InterceptedWindow): void {
  const nativeJson = Response.prototype.json;
  const nativeText = Response.prototype.text;
  const nativeParse = JSON.parse;

  const inspectResponse = async (url: string, response: Response): Promise<void> => {
    if (!isSupportedUrl(url)) return;
    try {
      inspectPayload(await nativeJson.call(response.clone()), url);
    } catch {
      // Inspection must never affect the host page.
    }
  };

  const wrappedFetches = new WeakSet<Function>();
  const wrapFetch = (original: typeof window.fetch): typeof window.fetch => {
    if (wrappedFetches.has(original)) return original;
    const wrapped: typeof window.fetch = function (this: Window, ...args) {
      const url = requestUrl(args[0]);
      const result = original.apply(this, args);
      if (url !== null) {
        void result.then((response) => inspectResponse(url, response));
      }
      return result;
    };
    wrappedFetches.add(original);
    wrappedFetches.add(wrapped);
    return wrapped;
  };

  page.fetch = wrapFetch(page.fetch);

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

  JSON.parse = function (...args: Parameters<JSON['parse']>) {
    const payload = nativeParse.apply(this, args);
    const text = args[0];
    if (typeof text === 'string' && TARGET_MARKERS.some((marker) => text.includes(marker))) {
      inspectPayload(payload);
    }
    return payload;
  };

  Response.prototype.json = function (...args) {
    return nativeJson.call(this, ...args).then((payload) => {
      inspectPayload(payload, this.url);
      return payload;
    });
  };
  Response.prototype.text = function (...args) {
    return nativeText.call(this, ...args).then((text) => {
      if (TARGET_MARKERS.some((marker) => text.includes(marker))) {
        try {
          inspectPayload(nativeParse(text), this.url);
        } catch {
          // Ignore marker-containing non-JSON text.
        }
      }
      return text;
    });
  };
}
function installXhrHooks(): void {
  const urls = new WeakMap<XMLHttpRequest, string>();
  const originalOpen = XMLHttpRequest.prototype.open as unknown as (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ) => void;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ) {
    urls.set(this, String(url));
    originalOpen.call(this, method, url, async, username, password);
  } as typeof XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.send = function (...args: Parameters<XMLHttpRequest['send']>) {
    this.addEventListener('load', () => {
      try {
        const url = urls.get(this) ?? this.responseURL;
        if (!isSupportedUrl(url)) return;
        const payload = this.responseType === 'json' ? this.response : JSON.parse(this.responseText);
        inspectPayload(payload, url);
      } catch {
        // Inspection must never affect the host page.
      }
    }, { once: true });
    return originalSend.apply(this, args);
  };
}

export function installInterceptors(): void {
  const page = window as InterceptedWindow;
  if (page[INSTALL_FLAG]) return;
  page[INSTALL_FLAG] = true;

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
