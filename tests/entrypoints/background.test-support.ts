import { afterAll, afterEach, beforeEach, expect } from 'bun:test';
import type { JobInsights } from '../../src/lib/insights';
import { STORE_JOB_INSIGHTS } from '../../src/lib/protocol';

type RuntimeListener = (
  message: unknown,
  sender: { tab?: { id?: number; url?: string } },
  sendResponse: (response?: unknown) => void,
) => unknown;
type TabUpdatedListener = (tabId: number, changeInfo: { status?: string; url?: string }) => void;
type TabRemovedListener = (tabId: number) => void;

export type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
  started: Promise<void>;
  start: () => void;
};

export function deferred(): Deferred {
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

export const values = new Map<string, unknown>();
export const badgeTextCalls: Array<{ tabId: number; text: string }> = [];
export const badgeBackgroundCalls: Array<{ tabId: number; color: string }> = [];
export let resolveBadgeTextApplied: (() => void) | undefined;
export let removedListener: TabRemovedListener | undefined;
export const tabUrls = new Map<number, string>();
export let listener: RuntimeListener | undefined;
export let updatedListener: TabUpdatedListener | undefined;
type ReplayResponder = (tabId: number, message: unknown) => Promise<unknown>;
export let nextSetGate: Deferred | undefined;
export let replayResponder: ReplayResponder | undefined;
export let nextRemoveGate: Deferred | undefined;
export let nextGetGate: Deferred | undefined;
export const pendingStorageOperations = new Set<Promise<unknown>>();

export function setNextSetGate(value: Deferred | undefined): void {
  nextSetGate = value;
}
export function setReplayResponder(value: ReplayResponder | undefined): void {
  replayResponder = value;
}
export function setNextRemoveGate(value: Deferred | undefined): void {
  nextRemoveGate = value;
}
export function setNextGetGate(value: Deferred | undefined): void {
  nextGetGate = value;
}
export function setResolveBadgeTextApplied(value: (() => void) | undefined): void {
  resolveBadgeTextApplied = value;
}

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

export const insights: JobInsights = {
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
export const visitorInsights: JobInsights = {
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
export function store(tabId: number, url: string, payload = insights): Promise<void> {
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
