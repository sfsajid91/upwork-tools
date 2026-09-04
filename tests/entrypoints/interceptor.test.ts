import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  isPageEvent,
  PAGE_EVENT_SOURCE,
  PAGE_EVENT_VERSION,
  REQUEST_CURRENT_JOB_INSIGHTS,
} from '../../src/lib/protocol';

const supportedUrl =
  'https://www.upwork.com/api/graphql/v2?alias=gql-query-get-auth-job-details-v2';
const visitorUrl = 'https://www.upwork.com/api/graphql/v2?alias=gql-query-get-visitor-job-details';
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
const visitorPayload = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../fixtures/sample-visitor-job-details.json', import.meta.url)),
    'utf8',
  ),
);

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
const messageListeners: Array<(event: unknown) => void> = [];
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
  else Reflect.deleteProperty(globals, 'window');
});
const fakeWindow = {
  origin: 'https://www.upwork.com',
  location: { href: 'https://www.upwork.com/nx/find-work/', origin: 'https://www.upwork.com' },
  fetch: async (input: unknown) => {
    if (String(input) === rejectedUrl) throw new Error('network failure');
    const response = new Response(fetchBody);
    Object.defineProperty(response, 'url', { value: String(input) });
    return response;
  },
  addEventListener(_type: string, listener: (event: unknown) => void) {
    messageListeners.push(listener);
  },
  postMessage(event: unknown) {
    events.push(event);
    resolveCapture?.();
    resolveCapture = undefined;
  },
};

globals.window = fakeWindow;
// Static import cannot work here because installInterceptors reads these globals at module load.
const { installInterceptors } = await import('../../src/lib/interceptor');
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

function dispatchReplayRequest(requestId: string): void {
  const event = {
    source: fakeWindow,
    origin: fakeWindow.origin,
    data: {
      source: PAGE_EVENT_SOURCE,
      version: PAGE_EVENT_VERSION,
      type: REQUEST_CURRENT_JOB_INSIGHTS,
      requestId,
    },
  };
  for (const listener of messageListeners) listener(event);
}

beforeEach(() => {
  events.length = 0;
  resolveCapture = undefined;
  fetchBody = JSON.stringify(payload);
  fakeWindow.location.href = 'https://www.upwork.com/nx/find-work/';
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
  test('captures a supported visitor response through the visitor alias', async () => {
    fetchBody = JSON.stringify(visitorPayload);
    const captured = waitForCapture();
    const response = await wrappedFetch(visitorUrl);
    expect(await response.json()).toEqual(visitorPayload);
    await captured;

    expect(events).toHaveLength(1);
    expect(isPageEvent(events[0])).toBe(true);
    if (!isPageEvent(events[0])) throw new Error('expected page event');
    expect(events[0].payload.viewerMode).toBe('visitor');
    expect(events[0].payload.job.title).toBe('Website Developer');
  });

  test('captures matching marker JSON and ignores mismatched job IDs', async () => {
    fakeWindow.location.href = 'https://www.upwork.com/ab/details/job-interceptor';
    const captured = waitForCapture();

    expect(() => JSON.parse(JSON.stringify(payload))).not.toThrow();
    await captured;

    expect(events).toHaveLength(1);
    expect(isPageEvent(events[0])).toBe(true);
    if (!isPageEvent(events[0])) throw new Error('expected a page event');
    expect(events[0].payload.job.id).toBe('job-interceptor');

    events.length = 0;
    expect(() =>
      JSON.parse(JSON.stringify(payload).replace('job-interceptor', 'other-job')),
    ).not.toThrow();
    await Promise.resolve();
    expect(events).toHaveLength(0);
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
  test('replays the latest same-job capture with its original timestamp', async () => {
    const captureId = `job-replay-${crypto.randomUUID()}`;
    fetchBody = JSON.stringify(payload).replace('job-interceptor', captureId);
    const captured = waitForCapture();
    await wrappedFetch(supportedUrl);
    await captured;
    fakeWindow.location.href = `https://www.upwork.com/ab/details/${captureId}`;

    dispatchReplayRequest('replay-1');
    expect(events).toHaveLength(2);
    expect(isPageEvent(events[1])).toBe(true);
    if (!isPageEvent(events[1]) || !isPageEvent(events[0])) throw new Error('expected page events');
    expect(events[1].payload).toEqual(events[0].payload);
    expect(events[1].replay?.requestId).toBe('replay-1');
    expect(events[1].replay?.capturedAt).not.toBe(0);
  });

  test('does not replay a capture on a different job or throw on host errors', async () => {
    const captureId = `job-replay-change-${crypto.randomUUID()}`;
    fetchBody = JSON.stringify(payload).replace('job-interceptor', captureId);
    const captured = waitForCapture();
    await wrappedFetch(supportedUrl);
    await captured;
    fakeWindow.location.href = 'https://www.upwork.com/ab/details/job-other';
    dispatchReplayRequest('replay-2');
    expect(events).toHaveLength(1);

    const originalPostMessage = fakeWindow.postMessage;
    fakeWindow.postMessage = () => {
      throw new Error('host failure');
    };
    expect(() => dispatchReplayRequest('replay-3')).not.toThrow();
    fakeWindow.postMessage = originalPostMessage;
  });
});

async function waitForEventCount(count: number, timeoutMs = 500): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline && events.length < count) {
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

describe('interceptor resilience', () => {
  test('captures refreshed payloads whose changes fall outside the old dedup key', async () => {
    const captureId = `job-refresh-${crypto.randomUUID()}`;
    fetchBody = JSON.stringify(payload).replace('job-interceptor', captureId);
    await wrappedFetch(supportedUrl);
    await waitForEventCount(1);

    fetchBody = fetchBody.replace('"status":"OPEN"', '"status":"FILLED"');
    await wrappedFetch(supportedUrl);
    await waitForEventCount(2);

    const payloads = events.filter(isPageEvent);
    expect(payloads).toHaveLength(2);
    if (!payloads[0] || !payloads[1]) throw new Error('expected two captured payloads');
    expect(payloads[0].payload.job.id).toBe(captureId);
    expect(payloads[0].payload.job.status).not.toBe(payloads[1].payload.job.status);
    expect(payloads[0].payload).not.toEqual(payloads[1].payload);
  });

  test('keeps capturing when the page replaces window.fetch after install', async () => {
    const captureId = `job-tamper-${crypto.randomUUID()}`;
    fetchBody = JSON.stringify(payload).replace('job-interceptor', captureId);
    const wrappedByInstall = fakeWindow.fetch;
    fakeWindow.fetch = async (input: unknown) => {
      const response = new Response(fetchBody);
      Object.defineProperty(response, 'url', { value: String(input) });
      return response;
    };
    try {
      await fakeWindow.fetch(supportedUrl);
      await waitForEventCount(1);
      expect(events.some((event) => isPageEvent(event) && event.payload.job.id === captureId)).toBe(
        true,
      );
    } finally {
      fakeWindow.fetch = wrappedByInstall;
    }
  });

  test('keeps capturing marker JSON when the page restores the native JSON.parse', async () => {
    const captureId = `job-parse-tamper-${crypto.randomUUID()}`;
    fakeWindow.location.href = `https://www.upwork.com/ab/details/${captureId}`;
    const parseBeforeTamper = JSON.parse;
    JSON.parse = nativeJsonParse;
    try {
      JSON.parse(JSON.stringify(payload).replace('job-interceptor', captureId));
      await waitForEventCount(1);
      expect(events.some((event) => isPageEvent(event) && event.payload.job.id === captureId)).toBe(
        true,
      );
    } finally {
      JSON.parse = parseBeforeTamper;
      fakeWindow.location.href = 'https://www.upwork.com/nx/find-work/';
    }
  });
});
