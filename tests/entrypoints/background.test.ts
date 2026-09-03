import { afterAll, afterEach, beforeEach, describe, expect, test } from 'bun:test';
import type { JobInsights } from '../../src/lib/insights';
import { GET_JOB_HISTORY, GET_JOB_INSIGHTS, STORE_JOB_INSIGHTS } from '../../src/lib/protocol';
type RuntimeListener = (
  message: unknown,
  sender: { tab?: { id?: number; url?: string } },
  sendResponse: (response?: unknown) => void,
) => unknown;
type TabUpdatedListener = (tabId: number, changeInfo: { status?: string; url?: string }) => void;
type TabRemovedListener = (tabId: number) => void;

type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
  started: Promise<void>;
  start: () => void;
};

function deferred(): Deferred {
  let resolve!: () => void;
  let start!: () => void;
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });
  const started = new Promise<void>((complete) => {
    start = complete;
  });
  return { promise, resolve, started, start };
}

const values = new Map<string, unknown>();
const badgeTextCalls: Array<{ tabId: number; text: string }> = [];
const badgeBackgroundCalls: Array<{ tabId: number; color: string }> = [];
let resolveBadgeTextApplied: (() => void) | undefined;
let removedListener: TabRemovedListener | undefined;
const tabUrls = new Map<number, string>();
let listener: RuntimeListener | undefined;
let updatedListener: TabUpdatedListener | undefined;
type ReplayResponder = (tabId: number, message: unknown) => Promise<unknown>;
let nextSetGate: Deferred | undefined;
let replayResponder: ReplayResponder | undefined;
let nextRemoveGate: Deferred | undefined;
let nextGetGate: Deferred | undefined;
const pendingStorageOperations = new Set<Promise<unknown>>();

function trackStorageOperation<T>(operation: Promise<T>): Promise<T> {
  pendingStorageOperations.add(operation);
  void operation.then(
    () => pendingStorageOperations.delete(operation),
    () => pendingStorageOperations.delete(operation),
  );
  return operation;
}

const fakeBrowser = {
  runtime: {
    onMessage: {
      addListener(callback: RuntimeListener) {
        listener = callback;
      },
    },
  },
  storage: {
    session: {
      set(items: Record<string, unknown>) {
        return trackStorageOperation(
          (async () => {
            if (nextSetGate) {
              const gate = nextSetGate;
              nextSetGate = undefined;
              gate.start();
              await gate.promise;
            }
            for (const [key, value] of Object.entries(items)) values.set(key, value);
          })(),
        );
      },
      async get(keys: string | string[]) {
        const requested = Array.isArray(keys) ? keys : [keys];
        return Object.fromEntries(requested.map((key) => [key, values.get(key)]));
      },
      remove(keys: string | string[]) {
        return trackStorageOperation(
          (async () => {
            if (nextRemoveGate) {
              const gate = nextRemoveGate;
              nextRemoveGate = undefined;
              gate.start();
              await gate.promise;
            }
            for (const key of Array.isArray(keys) ? keys : [keys]) values.delete(key);
          })(),
        );
      },
    },
  },
  action: {
    async setBadgeText(details: { tabId: number; text: string }) {
      badgeTextCalls.push(details);
      resolveBadgeTextApplied?.();
      resolveBadgeTextApplied = undefined;
    },
    async setBadgeBackgroundColor(details: { tabId: number; color: string }) {
      badgeBackgroundCalls.push(details);
    },
  },
  tabs: {
    onUpdated: {
      addListener(callback: TabUpdatedListener) {
        updatedListener = callback;
      },
    },
    onRemoved: {
      addListener(callback: TabRemovedListener) {
        removedListener = callback;
      },
    },
    async get(tabId: number) {
      if (nextGetGate) {
        const gate = nextGetGate;
        nextGetGate = undefined;
        gate.start();
        await gate.promise;
      }
      return { id: tabId, url: tabUrls.get(tabId) ?? 'https://www.upwork.com/ab/details/job-7' };
    },
    async sendMessage(tabId: number, message: unknown) {
      return replayResponder?.(tabId, message) ?? false;
    },
  },
};

const testGlobals = globalThis as unknown as {
  browser?: typeof fakeBrowser;
  defineBackground?: (callback: () => void) => unknown;
};
const hadBrowser = 'browser' in globalThis;
const previousBrowser = testGlobals.browser;
const hadDefineBackground = 'defineBackground' in globalThis;
const previousDefineBackground = testGlobals.defineBackground;
afterAll(() => {
  if (hadBrowser) testGlobals.browser = previousBrowser;
  else delete testGlobals.browser;
  if (hadDefineBackground) testGlobals.defineBackground = previousDefineBackground;
  else delete testGlobals.defineBackground;
});
testGlobals.browser = fakeBrowser;
testGlobals.defineBackground = (callback) => {
  callback();
};

// Static import cannot work here because the background entrypoint reads these test globals at load time.
await import(`../../src/entrypoints/background.ts?test=${crypto.randomUUID()}`);

const insights: JobInsights = {
  viewerMode: 'authenticated',
  job: {
    id: 'job-7',
    title: null,
    description: null,
    status: null,
    type: null,
    postedOn: null,
    publishTime: null,
    workload: null,
    contractorTier: null,
    budgetAmount: null,
    budgetCurrency: null,
    hourlyBudgetMin: null,
    hourlyBudgetMax: null,
    duration: null,
    category: null,
    skills: [],
    restrictions: [],
  },
  activity: {
    exactProposals: 4,
    interviewed: null,
    interviewRate: null,
    totalHired: null,
    positionsToHire: null,
    lastBuyerActivity: null,
  },
  client: {
    topClient: null,
    paymentVerified: null,
    country: null,
    city: null,
    totalAssignments: null,
    activeAssignments: null,
    hours: null,
    feedbackCount: null,
    rating: null,
    totalJobsWithHires: null,
    jobsPosted: null,
    hireRate: null,
    totalCharges: null,
    averageHourlyRate: null,
    memberSince: null,
  },
  fit: {
    qualificationsMatched: null,
    qualificationsTotal: null,
    qualificationDetails: null,
    freelancerHourlyRate: null,
    rateContext: null,
    applicationState: null,
  },
  history: { recentJobs: [], relatedJobs: [] },
  similarJobs: [],
  warnings: [],
};
const visitorInsights: JobInsights = {
  ...insights,
  viewerMode: 'visitor',
  fit: {
    ...insights.fit,
    freelancerHourlyRate: null,
    rateContext: null,
    applicationState: null,
  },
};
beforeEach(() => {
  values.clear();
  tabUrls.clear();
  badgeTextCalls.length = 0;
  badgeBackgroundCalls.length = 0;
  nextSetGate = undefined;
  replayResponder = undefined;
  nextRemoveGate = undefined;
  nextGetGate = undefined;
});
afterEach(async () => {
  while (pendingStorageOperations.size > 0) {
    await Promise.all([...pendingStorageOperations]);
  }
});
function store(tabId: number, url: string, payload = insights): Promise<void> {
  tabUrls.set(tabId, url);
  return new Promise((resolve) => {
    const returned = listener?.(
      { type: STORE_JOB_INSIGHTS, payload },
      { tab: { id: tabId, url } },
      () => {
        expect(returned).toBe(true);
        resolve();
      },
    );
  });
}
describe('background runtime messaging', () => {
  test('GET responds asynchronously with the stored snapshot', async () => {
    values.set('job-insights:7', insights);
    values.set('job-insights:7:metadata', { jobId: 'job-7', capturedAt: Date.now() });
    let response: unknown;
    const completed = new Promise<void>((resolve) => {
      const returned = listener?.({ type: GET_JOB_INSIGHTS, tabId: 7 }, {}, (value) => {
        response = value;
        expect(returned).toBe(true);
        resolve();
      });
    });

    await completed;
    expect(response).toEqual(insights);
  });
  test('GET returns null for a malformed stored snapshot', async () => {
    values.set('job-insights:8', { malformed: true });
    let response: unknown = 'not-called';
    const completed = new Promise<void>((resolve) => {
      const returned = listener?.({ type: GET_JOB_INSIGHTS, tabId: 8 }, {}, (value) => {
        response = value;
        expect(returned).toBe(true);
        resolve();
      });
    });

    await completed;
    expect(response).toBeNull();
  });

  test('STORE completes without writing when the sender tab id is invalid', async () => {
    let response: unknown = 'not-called';
    let returned: unknown;
    const completed = new Promise<void>((resolve) => {
      returned = listener?.(
        { type: STORE_JOB_INSIGHTS, payload: insights },
        { tab: { id: -1, url: 'https://www.upwork.com/ab/details/job-9' } },
        (value) => {
          response = value;
          resolve();
        },
      );
    });

    await completed;
    expect(returned).toBe(true);
    expect(response).toBe(undefined);
    expect(values.has('job-insights:9')).toBe(false);
  });

  test('stale STORE work is discarded after navigation starts', async () => {
    const gate = deferred();
    const payload = { ...insights, job: { ...insights.job, id: 'job-101' } };
    nextSetGate = gate;
    const completed = store(101, 'https://www.upwork.com/ab/details/job-101', payload);

    await gate.started;
    updatedListener?.(101, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-101-new',
    });
    gate.resolve();
    await completed;

    expect(values.has('job-insights:101')).toBe(false);
  });

  test('STORE received after navigation persists for the fresh generation', async () => {
    const payload = { ...insights, job: { ...insights.job, id: 'job-102' } };
    updatedListener?.(102, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-102',
    });

    await store(102, 'https://www.upwork.com/ab/details/job-102', payload);

    expect(values.get('job-insights:102')).toEqual(payload);
  });

  test('navigation clears the prior session snapshot before restoring state', async () => {
    values.set('job-insights:103', insights);
    values.set('job-insights:103:metadata', { jobId: 'job-7', capturedAt: Date.now() });
    updatedListener?.(103, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-103',
    });
    await Promise.all([...pendingStorageOperations]);
    expect(values.has('job-insights:103')).toBe(false);
    expect(values.has('job-insights:103:metadata')).toBe(false);
  });
  test('page reload clears the prior session snapshot without a URL update', async () => {
    const tabId = 108;
    values.set(`job-insights:${tabId}`, insights);
    values.set(`job-insights:${tabId}:metadata`, { jobId: 'job-7', capturedAt: Date.now() });
    tabUrls.set(tabId, 'https://www.upwork.com/ab/details/job-7');

    updatedListener?.(tabId, { status: 'loading' });
    await Promise.all([...pendingStorageOperations]);

    expect(values.has(`job-insights:${tabId}`)).toBe(false);
    expect(values.has(`job-insights:${tabId}:metadata`)).toBe(false);
  });
  test('URL-only SPA navigation clears the prior session snapshot', async () => {
    const tabId = 109;
    const url = 'https://www.upwork.com/ab/details/job-8';
    values.set(`job-insights:${tabId}`, insights);
    values.set(`job-insights:${tabId}:metadata`, { jobId: 'job-7', capturedAt: Date.now() });
    tabUrls.set(tabId, url);

    updatedListener?.(tabId, { status: 'complete' });
    updatedListener?.(tabId, { url });
    await Promise.all([...pendingStorageOperations]);

    expect(values.has(`job-insights:${tabId}`)).toBe(false);
    expect(values.has(`job-insights:${tabId}:metadata`)).toBe(false);
  });
  test('URL-only SPA navigation invalidates an in-flight STORE', async () => {
    const tabId = 110;
    const gate = deferred();
    nextSetGate = gate;
    const completed = store(tabId, 'https://www.upwork.com/ab/details/job-7');
    await gate.started;

    updatedListener?.(tabId, { status: 'complete' });
    updatedListener?.(tabId, { url: 'https://www.upwork.com/ab/details/job-8' });
    gate.resolve();
    await completed;
    await Promise.all([...pendingStorageOperations]);

    expect(values.has(`job-insights:${tabId}`)).toBe(false);
  });
  test('URL-first navigation does not double-advance around an intermediate STORE', async () => {
    const tabId = 112;
    const url = 'https://www.upwork.com/ab/details/job-8';
    const payload = { ...insights, job: { ...insights.job, id: 'job-8' } };

    updatedListener?.(tabId, { url });
    await store(tabId, url, payload);
    updatedListener?.(tabId, { status: 'loading' });
    await Promise.all([...pendingStorageOperations]);

    expect(values.get(`job-insights:${tabId}`)).toEqual(payload);
  });
  test('multi-stage navigation advances once and preserves a fresh STORE', async () => {
    const tabId = 111;
    const url = 'https://www.upwork.com/ab/details/job-8';
    updatedListener?.(tabId, { status: 'loading' });
    await Promise.all([...pendingStorageOperations]);

    const gate = deferred();
    nextSetGate = gate;
    const payload = { ...insights, job: { ...insights.job, id: 'job-8' } };
    const completed = store(tabId, url, payload);
    await gate.started;

    updatedListener?.(tabId, { url });
    gate.resolve();
    await completed;
    await Promise.all([...pendingStorageOperations]);

    expect(values.get(`job-insights:${tabId}`)).toEqual(payload);
  });
  test('loading a job clears its session snapshot before restoring its badge', async () => {
    const tabId = 104;
    const url = 'https://www.upwork.com/ab/details/job-7';
    const badgeApplied = Promise.withResolvers<void>();
    resolveBadgeTextApplied = badgeApplied.resolve;
    values.set(`job-insights:${tabId}`, insights);
    values.set(`job-insights:${tabId}:metadata`, { jobId: 'job-7', capturedAt: Date.now() });
    tabUrls.set(tabId, url);

    updatedListener?.(tabId, { status: 'loading', url });
    await badgeApplied.promise;

    expect(values.has(`job-insights:${tabId}`)).toBe(false);
    expect(values.has(`job-insights:${tabId}:metadata`)).toBe(false);
    expect(badgeTextCalls.at(-1)).toEqual({ tabId, text: '' });
  });
  test('STORE persists the snapshot, updates the badge, and completes via callback', async () => {
    let response: unknown = 'not-called';
    const completed = new Promise<void>((resolve) => {
      const returned = listener?.(
        { type: STORE_JOB_INSIGHTS, payload: insights },
        { tab: { id: 7, url: 'https://www.upwork.com/ab/details/job-7' } },
        (value) => {
          response = value;
          expect(returned).toBe(true);
          resolve();
        },
      );
    });

    await completed;
    expect(values.get('job-insights:7')).toEqual(insights);
    expect(badgeTextCalls.at(-1)).toEqual({ tabId: 7, text: '4' });
    expect(badgeBackgroundCalls.at(-1)).toEqual({ tabId: 7, color: '#152d4f' });
    expect(response).toBe(undefined);
  });
  test('does not downgrade an authenticated session capture with visitor data', async () => {
    await store(7, 'https://www.upwork.com/ab/details/job-7', insights);
    await store(7, 'https://www.upwork.com/ab/details/job-7', visitorInsights);

    expect(values.get('job-insights:7')).toEqual(insights);
  });
  test('does not downgrade an authenticated session with a null-ID visitor capture', async () => {
    await store(7, 'https://www.upwork.com/ab/details/job-7', insights);
    await store(7, 'https://www.upwork.com/ab/details/job-7', {
      ...visitorInsights,
      job: { ...visitorInsights.job, id: null },
    });

    expect(values.get('job-insights:7')).toEqual(insights);
  });

  test('upgrades a visitor session capture when authenticated data arrives', async () => {
    await store(7, 'https://www.upwork.com/ab/details/job-7', visitorInsights);
    await store(7, 'https://www.upwork.com/ab/details/job-7', insights);

    expect(values.get('job-insights:7')).toEqual(insights);
  });

  test('serializes GET behind an in-flight STORE without replay', async () => {
    const gate = deferred();
    nextSetGate = gate;
    const storeCompleted = store(106, 'https://www.upwork.com/ab/details/job-7');
    await gate.started;

    let replayed = false;
    replayResponder = async () => {
      replayed = true;
      return false;
    };
    let response: unknown;
    const getCompleted = Promise.withResolvers<void>();
    listener?.({ type: GET_JOB_INSIGHTS, tabId: 106 }, {}, (value) => {
      response = value;
      getCompleted.resolve();
    });

    gate.resolve();
    await storeCompleted;
    await getCompleted.promise;
    expect(response).toEqual(insights);
    expect(replayed).toBe(false);
  });

  test('intermediate navigation updates do not invalidate a fresh STORE', async () => {
    const tabId = 107;
    const gate = deferred();
    updatedListener?.(tabId, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-7',
    });
    nextSetGate = gate;
    const completed = store(tabId, 'https://www.upwork.com/ab/details/job-7');
    await gate.started;

    updatedListener?.(tabId, { status: 'loading' });
    updatedListener?.(tabId, { url: 'https://www.upwork.com/ab/details/job-7' });
    gate.resolve();
    await completed;

    expect(values.get(`job-insights:${tabId}`)).toEqual(insights);
  });
  test('skips identity-conflicting captures and badge updates', async () => {
    const payload = { ...insights, job: { ...insights.job, id: 'job-a' } };
    const completed = store(31, 'https://www.upwork.com/ab/details/job-b', payload);

    await completed;

    expect(values.has('job-insights:31')).toBe(false);
    expect(values.has('job-insights:31:metadata')).toBe(false);
    expect(badgeTextCalls).toEqual([]);
  });

  test('keeps a null-ID capture readable for the current tab', async () => {
    const payload = { ...insights, job: { ...insights.job, id: null } };
    const url = 'https://www.upwork.com/ab/details/job-32';

    await store(32, url, payload);

    expect(values.get('job-insights:32')).toEqual(payload);
    const metadata = values.get('job-insights:32:metadata') as
      | { jobId?: unknown; capturedAt?: unknown }
      | undefined;
    expect(metadata?.jobId).toBe('job-32');
    expect(typeof metadata?.capturedAt).toBe('number');

    let response: unknown;
    const completed = Promise.withResolvers<void>();
    listener?.({ type: GET_JOB_INSIGHTS, tabId: 32 }, {}, (value) => {
      response = value;
      completed.resolve();
    });
    await completed.promise;

    expect(response).toEqual(payload);
  });

  test('GET returns a capture whose public ID matches the tab URL', async () => {
    const publicPayload = { ...insights, job: { ...insights.job, id: 'public-job-id' } };
    const url = 'https://www.upwork.com/jobs/~public-job-id';
    await store(30, url, publicPayload);

    let response: unknown;
    const completed = Promise.withResolvers<void>();
    listener?.({ type: GET_JOB_INSIGHTS, tabId: 30 }, {}, (value) => {
      response = value;
      completed.resolve();
    });
    await completed.promise;

    expect(response).toEqual(publicPayload);
  });

  test('invalid messages are ignored without opening an async response channel', () => {
    let called = false;
    const returned = listener?.({ type: 'UNKNOWN' }, {}, () => {
      called = true;
    });

    expect(returned).toBe(undefined);
    expect(called).toBe(false);
  });
  test('GET requests same-job replay before returning empty', async () => {
    const replayCaptureAt = 123;
    values.set('job-insights:20', insights);
    tabUrls.set(20, 'https://www.upwork.com/ab/details/job-7');
    values.delete('job-insights:20:metadata');
    replayResponder = async (tabId) => {
      const { promise, resolve } = Promise.withResolvers<boolean>();
      listener?.(
        {
          type: STORE_JOB_INSIGHTS,
          payload: insights,
          replay: { capturedAt: replayCaptureAt },
        },
        { tab: { id: tabId, url: tabUrls.get(tabId) } },
        () => resolve(true),
      );
      return promise;
    };

    let response: unknown;
    const completed = Promise.withResolvers<void>();
    const returned = listener?.({ type: GET_JOB_INSIGHTS, tabId: 20 }, {}, (value) => {
      response = value;
      completed.resolve();
    });
    expect(returned).toBe(true);
    await completed.promise;
    expect(response).toEqual(insights);
    expect(values.get('job-insights:20:metadata')).toEqual({
      jobId: 'job-7',
      capturedAt: replayCaptureAt,
    });
  });

  test('GET rejects a preserved snapshot for a different current job', async () => {
    values.set('job-insights:21', insights);
    values.set('job-insights:21:metadata', { jobId: 'job-7', capturedAt: Date.now() });
    tabUrls.set(21, 'https://www.upwork.com/ab/details/job-21');
    let response: unknown;
    const completed = Promise.withResolvers<void>();
    listener?.({ type: GET_JOB_INSIGHTS, tabId: 21 }, {}, (value) => {
      response = value;
      completed.resolve();
    });
    await completed.promise;
    expect(response).toBeNull();
  });

  test('tab removal clears payload and verification metadata', async () => {
    values.set('job-insights:22', insights);
    values.set('job-insights:22:metadata', { jobId: 'job-7', capturedAt: Date.now() });
    removedListener?.(22);
    await Promise.all([...pendingStorageOperations]);
    expect(values.has('job-insights:22')).toBe(false);
    expect(values.has('job-insights:22:metadata')).toBe(false);
  });

  test('stale STORE cannot retain a latest session capture after navigation', async () => {
    const tabId = 23;
    const gate = deferred();
    nextSetGate = gate;
    const completed = store(tabId, 'https://www.upwork.com/ab/details/job-7');
    await gate.started;

    updatedListener?.(tabId, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-8',
    });
    gate.resolve();
    await completed;

    expect(values.has(`job-insights:${tabId}`)).toBe(false);
  });

  test('tab removal cleans the removed tab state before a reused tab ID writes', async () => {
    const tabId = 24;
    const gate = deferred();
    const replacement = { ...insights, job: { ...insights.job, id: 'job-24' } };
    values.set(`job-insights:${tabId}`, insights);
    values.set(`job-insights:${tabId}:metadata`, { jobId: 'job-7', capturedAt: Date.now() });
    nextRemoveGate = gate;
    removedListener?.(tabId);
    await gate.started;

    const completed = store(tabId, 'https://www.upwork.com/ab/details/job-24', replacement);
    gate.resolve();
    await completed;

    expect(values.get(`job-insights:${tabId}`)).toEqual(replacement);
  });

  test('history reads return null after tab removal invalidates their generation', async () => {
    const tabId = 25;
    const gate = deferred();
    tabUrls.set(tabId, 'https://www.upwork.com/ab/details/job-7');
    nextGetGate = gate;
    let response: unknown;
    const completed = Promise.withResolvers<void>();
    const returned = listener?.({ type: GET_JOB_HISTORY, tabId, jobId: 'job-7' }, {}, (value) => {
      response = value;
      completed.resolve();
    });
    expect(returned).toBe(true);
    await gate.started;
    removedListener?.(tabId);
    gate.resolve();
    await completed.promise;

    expect(response).toBeNull();
  });
});
