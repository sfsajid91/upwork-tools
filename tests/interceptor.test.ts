import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { isPageEvent } from '../lib/protocol';

const supportedUrl =
  'https://www.upwork.com/api/graphql/v2?alias=gql-query-get-auth-job-details-v2';
const unsupportedUrl = 'https://www.upwork.com/api/graphql/v2?alias=other-query';
const rejectedUrl = 'https://www.upwork.com/api/graphql/v2?alias=reject-query';

const payload = {
  data: {
    jobAuthDetails: {
      opening: {
        job: {
          status: 'OPEN',
          info: { id: 'job-interceptor', title: 'Interceptor test job' },
          clientActivity: { totalApplicants: 3 },
        },
      },
    },
  },
};

const globals = globalThis as unknown as { window?: unknown };
const hadWindow = 'window' in globalThis;
const previousWindow = globals.window;
const nativeJsonParse = JSON.parse;
const nativeResponseJsonDescriptor = Object.getOwnPropertyDescriptor(Response.prototype, 'json');
const nativeResponseTextDescriptor = Object.getOwnPropertyDescriptor(Response.prototype, 'text');
const nativeJsonParseDescriptor = Object.getOwnPropertyDescriptor(JSON, 'parse');
const xhrPrototype = typeof XMLHttpRequest === 'undefined' ? undefined : XMLHttpRequest.prototype;
const nativeXhrOpen = xhrPrototype
  ? Object.getOwnPropertyDescriptor(xhrPrototype, 'open')
  : undefined;
const nativeXhrSend = xhrPrototype
  ? Object.getOwnPropertyDescriptor(xhrPrototype, 'send')
  : undefined;
const events: unknown[] = [];
let resolveCapture: (() => void) | undefined;
let fetchBody = JSON.stringify(payload);
afterAll(() => {
  if (nativeResponseJsonDescriptor) {
    Object.defineProperty(Response.prototype, 'json', nativeResponseJsonDescriptor);
  } else Reflect.deleteProperty(Response.prototype, 'json');
  if (nativeResponseTextDescriptor) {
    Object.defineProperty(Response.prototype, 'text', nativeResponseTextDescriptor);
  } else Reflect.deleteProperty(Response.prototype, 'text');
  if (nativeJsonParseDescriptor) Object.defineProperty(JSON, 'parse', nativeJsonParseDescriptor);
  else Reflect.deleteProperty(JSON, 'parse');
  if (xhrPrototype) {
    if (nativeXhrOpen) Object.defineProperty(xhrPrototype, 'open', nativeXhrOpen);
    else Reflect.deleteProperty(xhrPrototype, 'open');
    if (nativeXhrSend) Object.defineProperty(xhrPrototype, 'send', nativeXhrSend);
    else Reflect.deleteProperty(xhrPrototype, 'send');
  }
  if (hadWindow) globals.window = previousWindow;
  else delete globals.window;
});
const fakeWindow = {
  origin: 'https://www.upwork.com',
  location: { href: 'https://www.upwork.com/jobs/' },
  fetch: async (input: unknown) => {
    if (String(input) === rejectedUrl) throw new Error('network failure');
    const response = new Response(fetchBody);
    Object.defineProperty(response, 'url', { value: String(input) });
    return response;
  },
  postMessage(event: unknown) {
    events.push(event);
    resolveCapture?.();
    resolveCapture = undefined;
  },
};

globals.window = fakeWindow;
// Static import cannot work here because installInterceptors reads these globals at module load.
const { installInterceptors } = await import('../lib/interceptor');
installInterceptors();
const wrappedFetch = fakeWindow.fetch;

function responseAt(url: string, body: string): Response {
  const response = new Response(body);
  Object.defineProperty(response, 'url', { value: url });
  return response;
}

function waitForCapture(): Promise<void> {
  const deferred = Promise.withResolvers<void>();
  resolveCapture = deferred.resolve;
  return deferred.promise;
}

beforeEach(() => {
  events.length = 0;
  resolveCapture = undefined;
  fetchBody = JSON.stringify(payload);
});

describe('interceptor inspection', () => {
  test('captures a supported response and ignores an arbitrary JSON.parse', async () => {
    expect(() => JSON.parse(JSON.stringify(payload))).not.toThrow();
    expect(events).toHaveLength(0);

    const captureId = `job-interceptor-${crypto.randomUUID()}`;
    fetchBody = JSON.stringify(payload).replace('job-interceptor', captureId);
    const expectedBody = nativeJsonParse(fetchBody);
    const captured = waitForCapture();
    const response = await wrappedFetch(supportedUrl);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expectedBody);
    await captured;

    expect(events).toHaveLength(1);
    expect(isPageEvent(events[0])).toBe(true);
    if (!isPageEvent(events[0])) throw new Error('expected a page event');
    expect(events[0].payload.job.id).toBe(captureId);
  });
  test('does not capture unsupported URLs or marker text that fails inspection', async () => {
    const unsupportedBody = JSON.stringify(payload);
    expect(await responseAt(unsupportedUrl, unsupportedBody).text()).toBe(unsupportedBody);
    const malformedBody = '{"jobAuthDetails":';
    expect(await responseAt(supportedUrl, malformedBody).text()).toBe(malformedBody);

    expect(events).toHaveLength(0);
  });
  test('keeps supported text capture when arbitrary JSON.parse rejects', async () => {
    JSON.parse = (() => {
      throw new Error('arbitrary parse failure');
    }) as JSON['parse'];

    try {
      expect(() => JSON.parse(JSON.stringify(payload))).toThrow('arbitrary parse failure');
      const captured = waitForCapture();
      const body = JSON.stringify(payload).replace('job-interceptor', 'job-parse');
      expect(await responseAt(supportedUrl, body).text()).toBe(body);
      await captured;

      expect(events).toHaveLength(1);
      expect(isPageEvent(events[0])).toBe(true);
    } finally {
      JSON.parse = nativeJsonParse;
    }
  });

  test('keeps rejected fetch inspection from changing the fetch rejection', async () => {
    let unhandled = false;
    const onUnhandled = () => {
      unhandled = true;
    };
    process.on('unhandledRejection', onUnhandled);

    try {
      await expect(wrappedFetch(rejectedUrl)).rejects.toThrow('network failure');
      await Promise.resolve();
      expect(unhandled).toBe(false);
      expect(events).toHaveLength(0);
    } finally {
      process.off('unhandledRejection', onUnhandled);
    }
  });
});
