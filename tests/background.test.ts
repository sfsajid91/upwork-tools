import { afterAll, afterEach, beforeEach, describe, expect, test } from 'bun:test';
import type { JobInsights } from '../lib/insights';
import { GET_JOB_INSIGHTS, STORE_JOB_INSIGHTS } from '../lib/protocol';

type RuntimeListener = (
  message: unknown,
  sender: { tab?: { id?: number; url?: string } },
  sendResponse: (response?: unknown) => void,
) => unknown;
type TabUpdatedListener = (tabId: number, changeInfo: { status?: string; url?: string }) => void;

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
let listener: RuntimeListener | undefined;
let updatedListener: TabUpdatedListener | undefined;
let nextSetGate: Deferred | undefined;
let nextRemoveGate: Deferred | undefined;
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
      async get(key: string) {
        return { [key]: values.get(key) };
      },
      remove(key: string) {
        return trackStorageOperation(
          (async () => {
            if (nextRemoveGate) {
              const gate = nextRemoveGate;
              nextRemoveGate = undefined;
              gate.start();
              await gate.promise;
            }
            values.delete(key);
          })(),
        );
      },
    },
  },
  action: {
    async setBadgeText(details: { tabId: number; text: string }) {
      badgeTextCalls.push(details);
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
    onRemoved: { addListener() {} },
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
await import(`../entrypoints/background.ts?test=${crypto.randomUUID()}`);

const insights: JobInsights = {
  job: {
    id: null,
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
    freelancerHourlyRate: null,
    rateContext: null,
    applicationState: null,
  },
  history: { recentJobs: [], relatedJobs: [] },
  warnings: [],
};
beforeEach(() => {
  values.clear();
  badgeTextCalls.length = 0;
  badgeBackgroundCalls.length = 0;
  nextSetGate = undefined;
  nextRemoveGate = undefined;
});
afterEach(async () => {
  while (pendingStorageOperations.size > 0) {
    await Promise.all([...pendingStorageOperations]);
  }
});

function store(tabId: number, url: string, payload = insights): Promise<void> {
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
    nextSetGate = gate;
    const completed = store(101, 'https://www.upwork.com/ab/details/job-101');

    await gate.started;
    updatedListener?.(101, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-101-new',
    });
    gate.resolve();
    await completed;

    expect(values.get('job-insights:101')).toBe(undefined);
  });

  test('STORE received after navigation persists for the fresh generation', async () => {
    updatedListener?.(102, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-102',
    });

    await store(102, 'https://www.upwork.com/ab/details/job-102');

    expect(values.get('job-insights:102')).toEqual(insights);
  });

  test('queued navigation cleanup cannot delete a fresh-generation snapshot', async () => {
    values.set('job-insights:103', insights);
    const gate = deferred();
    nextRemoveGate = gate;
    updatedListener?.(103, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-103',
    });
    await gate.started;

    updatedListener?.(103, {
      status: 'loading',
      url: 'https://www.upwork.com/ab/details/job-103-newer',
    });
    const completed = store(103, 'https://www.upwork.com/ab/details/job-103-newer');
    gate.resolve();
    await completed;

    expect(values.get('job-insights:103')).toEqual(insights);
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

  test('invalid messages are ignored without opening an async response channel', () => {
    let called = false;
    const returned = listener?.({ type: 'UNKNOWN' }, {}, () => {
      called = true;
    });

    expect(returned).toBe(undefined);
    expect(called).toBe(false);
  });
});
