import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import type { JobInsights } from '../../src/lib/insights';
import type { JobRecord } from '../../src/lib/storage';

type RequestHandler = ((event: unknown) => void) | null;

class FakeRequest<T = unknown> {
  result!: T;
  error: Error | null = null;
  onsuccess: RequestHandler = null;
  onerror: RequestHandler = null;
  onupgradeneeded: RequestHandler = null;
}

type StoreData = {
  keyPath: string;
  autoIncrement?: boolean;
  nextKey: number;
  records: Map<IDBValidKey, Record<string, unknown>>;
};

class FakeTransaction {
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  private pending = 0;

  constructor(private readonly database: FakeDatabase) {}

  objectStore(name: string): FakeObjectStore {
    const store = this.database.stores.get(name);
    if (!store) throw new Error(`Missing store: ${name}`);
    return new FakeObjectStore(this, store);
  }

  request<T>(operation: () => T): FakeRequest<T> {
    const request = new FakeRequest<T>();
    this.pending += 1;
    queueMicrotask(() => {
      try {
        request.result = operation();
        request.onsuccess?.({});
      } catch (error) {
        request.error = error instanceof Error ? error : new Error(String(error));
        request.onerror?.({});
        this.onerror?.();
      } finally {
        this.pending -= 1;
        if (this.pending === 0) queueMicrotask(() => queueMicrotask(() => this.oncomplete?.()));
      }
    });
    return request;
  }

  abort(): void {
    this.onabort?.();
  }
}

class FakeObjectStore {
  readonly indexNames = { contains: () => false };

  constructor(
    private readonly transaction: FakeTransaction,
    private readonly data: StoreData,
  ) {}

  createIndex(): void {}

  put(value: Record<string, unknown>): FakeRequest<IDBValidKey> {
    return this.transaction.request(() => {
      const key = this.data.autoIncrement
        ? this.data.nextKey++
        : (value[this.data.keyPath] as IDBValidKey);
      this.data.records.set(key, { ...value });
      return key;
    });
  }

  get(key: IDBValidKey): FakeRequest<Record<string, unknown> | undefined> {
    return this.transaction.request(() => {
      const value = this.data.records.get(key);
      return value ? { ...value } : undefined;
    });
  }

  getAll(): FakeRequest<Record<string, unknown>[]> {
    return this.transaction.request(() =>
      [...this.data.records.values()].map((value) => ({ ...value })),
    );
  }

  delete(key: IDBValidKey): FakeRequest<undefined> {
    return this.transaction.request(() => {
      this.data.records.delete(key);
      return undefined;
    });
  }

  clear(): FakeRequest<undefined> {
    return this.transaction.request(() => {
      this.data.records.clear();
      return undefined;
    });
  }
}

class FakeDatabase {
  readonly stores = new Map<string, StoreData>();
  readonly objectStoreNames = { contains: (name: string) => this.stores.has(name) };

  createObjectStore(
    name: string,
    options: { keyPath: string; autoIncrement?: boolean },
  ): FakeObjectStore {
    const data: StoreData = { ...options, nextKey: 1, records: new Map() };
    this.stores.set(name, data);
    return new FakeObjectStore(new FakeTransaction(this), data);
  }

  transaction(stores: string | string[]): FakeTransaction {
    for (const name of Array.isArray(stores) ? stores : [stores]) {
      if (!this.stores.has(name)) throw new Error(`Missing store: ${name}`);
    }
    return new FakeTransaction(this);
  }

  close(): void {}
}

class FakeIndexedDB {
  private readonly database = new FakeDatabase();

  open(): FakeRequest<FakeDatabase> {
    const request = new FakeRequest<FakeDatabase>();
    queueMicrotask(() => {
      request.result = this.database;
      request.onupgradeneeded?.({ target: request });
      request.onsuccess?.({});
    });
    return request;
  }
}

type TestGlobals = typeof globalThis & { indexedDB?: IDBFactory };
const testGlobals = globalThis as TestGlobals;
const hadIndexedDB = 'indexedDB' in globalThis;
const previousIndexedDB = testGlobals.indexedDB;
const fakeIndexedDB = new FakeIndexedDB();
testGlobals.indexedDB = fakeIndexedDB as unknown as IDBFactory;

const { clearAllLocalData, getJob, putJob } = await import('../../src/lib/database');
const {
  bookmarkJob,
  clearWatchlist,
  getWatchlistedJob,
  listWatchlistedJobs,
  removeWatchlistedJob,
  updateWatchlistFromCapture,
} = await import('../../src/lib/watchlist');

const capture = (id: string): JobInsights => ({
  viewerMode: 'authenticated',
  job: {
    id,
    title: `Job ${id}`,
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
    exactProposals: null,
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
});

beforeEach(async () => {
  testGlobals.indexedDB = fakeIndexedDB as unknown as IDBFactory;
  await clearAllLocalData();
});

afterAll(() => {
  if (hadIndexedDB) testGlobals.indexedDB = previousIndexedDB;
  else Reflect.deleteProperty(testGlobals, 'indexedDB');
});

describe('watchlist persistence', () => {
  test('isolates bookmarks and supports normalized removal', async () => {
    expect(await bookmarkJob(capture(' job-a '), 1)).toBe(true);
    expect(await bookmarkJob(capture('job-b'), 2)).toBe(true);

    expect((await listWatchlistedJobs()).map(({ jobId }) => jobId).sort()).toEqual([
      'job-a',
      'job-b',
    ]);
    expect((await getWatchlistedJob(' job-a '))?.job.id).toBe('job-a');

    expect(await removeWatchlistedJob(' job-a ')).toBe(true);
    expect(await getWatchlistedJob('job-a')).toBeNull();
    expect((await listWatchlistedJobs()).map(({ jobId }) => jobId)).toEqual(['job-b']);
  });
  test('normalizes tilde-prefixed public IDs for every operation', async () => {
    expect(await bookmarkJob(capture('~job-c'))).toBe(true);
    expect((await listWatchlistedJobs()).map(({ jobId }) => jobId)).toEqual(['job-c']);
    expect((await getWatchlistedJob('~job-c'))?.job.id).toBe('job-c');

    expect(await removeWatchlistedJob('~job-c')).toBe(true);
    expect(await getWatchlistedJob('job-c')).toBeNull();
    expect(await listWatchlistedJobs()).toEqual([]);
  });
  test('refreshes existing bookmarks without creating new ones', async () => {
    const original = capture('job-refresh');
    expect(await bookmarkJob(original)).toBe(true);

    const updated = {
      ...original,
      job: { ...original.job, title: 'Updated title' },
    };
    expect(await updateWatchlistFromCapture(updated, 7)).toBe(true);
    expect(await getWatchlistedJob('job-refresh')).toMatchObject({
      jobId: 'job-refresh',
      job: { title: 'Updated title' },
      latestSnapshotId: 7,
    });

    expect(await updateWatchlistFromCapture(capture('not-saved'))).toBe(false);
    expect(await getWatchlistedJob('not-saved')).toBeNull();
  });
  test('preserves authenticated bookmark insights on visitor refresh', async () => {
    const authenticated = capture('job-authenticated');
    expect(await bookmarkJob(authenticated, 3)).toBe(true);

    const visitor = {
      ...authenticated,
      viewerMode: 'visitor' as const,
      job: { ...authenticated.job, title: 'Visitor title' },
      fit: {
        ...authenticated.fit,
        freelancerHourlyRate: null,
        rateContext: null,
        applicationState: null,
      },
    };
    expect(await updateWatchlistFromCapture(visitor, 9)).toBe(true);
    expect(await getWatchlistedJob('job-authenticated')).toMatchObject({
      job: { title: 'Job job-authenticated' },
      insights: authenticated,
      latestSnapshotId: 9,
    });
  });

  test('clearWatchlist clears bookmarks without clearing another local store', async () => {
    const retainedJob: JobRecord = {
      jobId: 'retained-job',
      job: capture('retained-job').job,
      client: capture('retained-job').client,
    };
    await putJob(retainedJob);
    await bookmarkJob(capture('bookmarked-job'));

    expect(await clearWatchlist()).toBe(true);
    expect(await listWatchlistedJobs()).toEqual([]);
    expect(await getJob('retained-job')).toEqual(retainedJob);
  });

  test('degrades safely when IndexedDB is unavailable and restores the global', async () => {
    Reflect.deleteProperty(testGlobals, 'indexedDB');
    try {
      expect(await bookmarkJob(capture('offline'))).toBe(false);
      expect(await getWatchlistedJob('offline')).toBeNull();
      expect(await listWatchlistedJobs()).toEqual([]);
      expect(await removeWatchlistedJob('offline')).toBe(false);
      expect(await clearWatchlist()).toBe(false);
    } finally {
      testGlobals.indexedDB = fakeIndexedDB as unknown as IDBFactory;
    }

    expect(await bookmarkJob(capture('restored'))).toBe(true);
    expect(await getWatchlistedJob('restored')).not.toBeNull();
  });
});
