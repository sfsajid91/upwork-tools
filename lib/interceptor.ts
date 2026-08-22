import { normalizeJobInsights } from './insights';
import { createPageEvent } from './protocol';

const JOB_DETAILS_PATH = '/api/graphql/v1';
const JOB_DETAILS_ALIAS = 'gql-query-get-auth-job-details-v2';
const INSTALL_FLAG = '__UPWORK_TOOLS_INTERCEPTOR__';

type WindowWithInstallFlag = Window & {
  [INSTALL_FLAG]?: boolean;
};

function isSupportedJobDetailsUrl(value: string): boolean {
  try {
    const url = new URL(value, window.location.href);
    return (
      url.hostname.endsWith('.upwork.com') &&
      url.pathname === JOB_DETAILS_PATH &&
      url.searchParams.get('alias') === JOB_DETAILS_ALIAS
    );
  } catch {
    return false;
  }
}

function emitPayload(payload: unknown): void {
  try {
    const insights = normalizeJobInsights(payload);
    if (insights) {
      window.postMessage(createPageEvent(insights), window.location.origin);
    }
  } catch {
    // Inspection must never affect the host page.
  }
}

function installResponseHooks(): void {
  const responsePrototype = Response.prototype;
  const originalJson = responsePrototype.json;
  const originalText = responsePrototype.text;
  const inspected = new WeakSet<Response>();

  const inspectResponse = (response: Response): void => {
    if (!isSupportedJobDetailsUrl(response.url) || inspected.has(response)) return;
    inspected.add(response);
    void originalJson
      .call(response.clone())
      .then(emitPayload)
      .catch(() => undefined);
  };

  responsePrototype.json = function (...args) {
    return originalJson.call(this, ...args).then((payload) => {
      if (!inspected.has(this) && isSupportedJobDetailsUrl(this.url)) {
        inspected.add(this);
        emitPayload(payload);
      }
      return payload;
    });
  };

  responsePrototype.text = function (...args) {
    return originalText.call(this, ...args).then((text) => {
      if (!inspected.has(this) && isSupportedJobDetailsUrl(this.url)) {
        inspected.add(this);
        try {
          emitPayload(JSON.parse(text));
        } catch {
          // Non-JSON response; leave the host response untouched.
        }
      }
      return text;
    });
  };

  const originalFetch = window.fetch;
  window.fetch = ((...args) => {
    const result = originalFetch(...args);
    result.then(inspectResponse).catch(() => undefined);
    return result;
  }) as typeof window.fetch;
}

function installXhrHooks(): void {
  const urls = new WeakMap<XMLHttpRequest, string>();
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  const open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ): void {
    urls.set(this, String(url));
    originalOpen.call(this, method, url, async ?? true, username, password);
  };
  XMLHttpRequest.prototype.open = open as XMLHttpRequest['open'];

  XMLHttpRequest.prototype.send = function (...args) {
    const xhr = this;
    xhr.addEventListener('load', () => {
      const url = urls.get(xhr) ?? xhr.responseURL;
      if (!isSupportedJobDetailsUrl(url) || (xhr.status !== 0 && xhr.status < 200)) return;
      const body = xhr.responseType === '' || xhr.responseType === 'text' ? xhr.responseText : null;
      if (!body) return;
      try {
        emitPayload(JSON.parse(body));
      } catch {
        // Non-JSON response; leave the host response untouched.
      }
    });
    return originalSend.apply(this, args);
  };
}

export function installInterceptors(): void {
  const pageWindow = window as WindowWithInstallFlag;
  if (pageWindow[INSTALL_FLAG]) return;
  pageWindow[INSTALL_FLAG] = true;

  try {
    installResponseHooks();
  } catch {
    // A browser-specific hook can fail without affecting the page.
  }
  try {
    installXhrHooks();
  } catch {
    // A browser-specific hook can fail without affecting the page.
  }
}
