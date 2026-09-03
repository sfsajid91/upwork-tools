import { describe, expect, test } from 'bun:test';
import {
  appendJobSnapshotIfChanged,
  clearAllLocalData,
  clearHistory,
  DATABASE_STORES,
  enforceHistoryRetention,
  getApplication,
  getJob,
  getWatchlist,
  listJobSnapshots,
  openDatabase,
  putApplication,
  putJob,
  putJobSnapshot,
  putWatchlist,
  runTransaction,
} from '../../src/lib/database';
import type { JobInsights } from '../../src/lib/insights';
import { STORE_JOB_INSIGHTS } from '../../src/lib/protocol';
import type { JobRecord, JobSnapshotRecord, WatchlistRecord } from '../../src/lib/storage';

type RuntimeListener = (
  message: unknown,
  sender: { tab?: { id?: number; url?: string } },
  sendResponse: (response?: unknown) => void,
) => unknown;

type FakeBrowser = {
  runtime: { onMessage: { addListener: (callback: RuntimeListener) => void } };
  storage: {
    session: {
      set: (items: Record<string, unknown>) => Promise<void>;
      get: (key: string) => Promise<Record<string, unknown>>;
      remove: (key: string) => Promise<void>;
    };
  };
  action: {
    setBadgeText: (details: { tabId: number; text: string }) => Promise<void>;
    setBadgeBackgroundColor: (details: { tabId: number; color: string }) => Promise<void>;
  };
  tabs: {
    onUpdated: { addListener: (callback: () => void) => void };
    onRemoved: { addListener: (callback: () => void) => void };
  };
};

type TestGlobals = typeof globalThis & {
  browser?: FakeBrowser;
  defineBackground?: (callback: () => void) => unknown;
};

const testGlobals = globalThis as TestGlobals;

const job = {
  jobId: 'job-1',
  job: {} as JobInsights['job'],
  client: {} as JobInsights['client'],
} satisfies JobRecord;
const snapshot = {
  jobId: 'job-1',
  applicants: 1,
  interviewed: 2,
  hired: 3,
  positions: 1,
  capturedAt: Date.now(),
} satisfies JobSnapshotRecord;
const application = {
  jobId: 'job-1',
  state: null,
  viewedAt: null,
  appliedAt: null,
  interviewedAt: null,
  hiredAt: null,
};
const watchlist = {
  jobId: 'job-1',
  job: {} as JobInsights['job'],
  latestSnapshotId: null,
  savedAt: Date.now(),
} satisfies WatchlistRecord;

async function expectSafeDatabaseResults(): Promise<void> {
  expect(await runTransaction(DATABASE_STORES.jobs, 'readonly', () => true)).toBeNull();
  expect(await putJob(job)).toBe(false);
  expect(await getJob('job-1')).toBeNull();
  expect(await putJobSnapshot(snapshot)).toBeNull();
  expect(await appendJobSnapshotIfChanged(snapshot)).toBeNull();
  expect(await listJobSnapshots('job-1')).toEqual([]);
  expect(await putApplication(application)).toBe(false);
  expect(await getApplication('job-1')).toBeNull();
  expect(await putWatchlist(watchlist)).toBe(false);
  expect(await getWatchlist('job-1')).toBeNull();
  expect(await enforceHistoryRetention()).toBe(false);
  expect(await clearHistory()).toBe(false);
  expect(await clearAllLocalData()).toBe(false);
}

function openFailureFactory(): IDBFactory {
  return {
    open() {
      throw new Error('IndexedDB unavailable');
    },
  } as unknown as IDBFactory;
}

function transactionFailureFactory(): IDBFactory {
  const database = {
    onversionchange: null,
    close() {},
    transaction() {
      throw new Error('transaction unavailable');
    },
  };
  return {
    open() {
      const request = {
        result: database,
        onupgradeneeded: null,
        onsuccess: null as (() => void) | null,
        onerror: null,
        onblocked: null,
      };
      queueMicrotask(() => request.onsuccess?.());
      return request;
    },
  } as unknown as IDBFactory;
}

function restoreGlobal(
  name: 'indexedDB' | 'browser' | 'defineBackground',
  had: boolean,
  previous: unknown,
) {
  if (had) {
    (testGlobals as Record<string, unknown>)[name] = previous;
  } else {
    delete (testGlobals as Record<string, unknown>)[name];
  }
}

describe('storage degradation', () => {
  test('keeps database calls safe and STORE session-only when IndexedDB is unavailable', async () => {
    const hadIndexedDB = 'indexedDB' in globalThis;
    const previousIndexedDB = testGlobals.indexedDB;
    const hadBrowser = 'browser' in globalThis;
    const previousBrowser = testGlobals.browser;
    const hadDefineBackground = 'defineBackground' in globalThis;
    const previousDefineBackground = testGlobals.defineBackground;
    const values = new Map<string, unknown>();
    let runtimeListener: RuntimeListener | undefined;
    let responseCount = 0;
    const payload: JobInsights = {
      viewerMode: 'authenticated',
      job: {
        id: 'job-1',
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

    try {
      Reflect.deleteProperty(testGlobals, 'indexedDB');
      expect(await openDatabase()).toBeNull();
      await expectSafeDatabaseResults();

      testGlobals.browser = {
        runtime: {
          onMessage: {
            addListener(callback) {
              runtimeListener = callback;
            },
          },
        },
        storage: {
          session: {
            async set(items) {
              for (const [key, value] of Object.entries(items)) values.set(key, value);
            },
            async get(key) {
              return { [key]: values.get(key) };
            },
            async remove(key) {
              values.delete(key);
            },
          },
        },
        action: {
          async setBadgeText() {},
          async setBadgeBackgroundColor() {},
        },
        tabs: {
          onUpdated: { addListener() {} },
          onRemoved: { addListener() {} },
        },
      };
      testGlobals.defineBackground = (callback) => callback();
      await import(
        `../../src/entrypoints/background.ts?storage-degradation=${crypto.randomUUID()}`
      );

      const completed = new Promise<void>((resolve) => {
        const returned = runtimeListener?.(
          { type: STORE_JOB_INSIGHTS, payload },
          { tab: { id: 23, url: 'https://www.upwork.com/jobs/job-1' } },
          () => {
            expect(returned).toBe(true);
            responseCount += 1;
            resolve();
          },
        );
        expect(returned).toBe(true);
      });
      await completed;
      expect(responseCount).toBe(1);
      expect(values.get('job-insights:23')).toBe(payload);

      testGlobals.indexedDB = openFailureFactory();
      expect(await openDatabase()).toBeNull();
      await expectSafeDatabaseResults();

      testGlobals.indexedDB = transactionFailureFactory();
      expect(await openDatabase()).not.toBeNull();
      await expectSafeDatabaseResults();
    } finally {
      restoreGlobal('indexedDB', hadIndexedDB, previousIndexedDB);
      restoreGlobal('browser', hadBrowser, previousBrowser);
      restoreGlobal('defineBackground', hadDefineBackground, previousDefineBackground);
    }
  });
});
