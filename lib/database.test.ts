import { afterAll, beforeEach, describe, expect, test } from 'bun:test';
import {
  DATABASE_STORES,
  appendJobSnapshotIfChanged,
  clearAllLocalData,
  clearHistory,
  enforceHistoryRetention,
  getApplication,
  getJob,
  getLatestJobCapture,
  getWatchlist,
  listApplications,
  listJobSnapshots,
  mergeApplication,
  openDatabase,
  putApplication,
  putJob,
  putJobSnapshot,
  putLatestJobCapture,
  putWatchlist,
} from './database';
import { normalizeJobInsights, type JobInsights } from './insights';
import type { JobSnapshotRecord } from './storage';

class FakeRequest<T = unknown> {
  result!: T;
  error: Error | null = null;
  onsuccess: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
}

type StoreData = {
  keyPath: string;
  autoIncrement?: boolean;
  nextKey: number;
  records: Map<IDBValidKey, Record<string, unknown>>;
  indexes: string[];
};

class FakeTransaction {
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  private pending = 0;
  private readonly database: FakeDatabase;

  constructor(database: FakeDatabase) {
    this.database = database;
  }

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
        if (this.pending === 0) {
          queueMicrotask(() => queueMicrotask(() => this.oncomplete?.()));
        }
      }
    });
    return request;
  }
}

class FakeObjectStore {
  readonly indexNames: { contains: (name: string) => boolean };
  private readonly transaction: FakeTransaction;
  private readonly data: StoreData;

  constructor(transaction: FakeTransaction, data: StoreData) {
    this.transaction = transaction;
    this.data = data;
    this.indexNames = { contains: (name) => data.indexes.includes(name) };
  }

  createIndex(name: string): void {
    if (!this.data.indexes.includes(name)) this.data.indexes.push(name);
  }

  add(value: Record<string, unknown>): FakeRequest<IDBValidKey> {
    return this.transaction.request<IDBValidKey>(() => {
      const key = this.data.autoIncrement
        ? this.data.nextKey++
        : (value[this.data.keyPath] as IDBValidKey);
      if (this.data.records.has(key)) throw new Error('ConstraintError');
      this.data.records.set(key, { ...value });
      return key;
    });
  }

  put(value: Record<string, unknown>): FakeRequest<IDBValidKey> {
    return this.transaction.request<IDBValidKey>(() => {
      const key = value[this.data.keyPath] as IDBValidKey;
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

  getAllKeys(): FakeRequest<IDBValidKey[]> {
    return this.transaction.request(() => [...this.data.records.keys()]);
  }

  clear(): FakeRequest<undefined> {
    return this.transaction.request(() => {
      this.data.records.clear();
      return undefined;
    });
  }

  delete(key: IDBValidKey): FakeRequest<undefined> {
    return this.transaction.request(() => {
      this.data.records.delete(key);
      return undefined;
    });
  }
  openCursor(): FakeRequest<IDBCursorWithValue | null> {
    const entries = [...this.data.records.entries()];
    let index = 0;
    let request!: FakeRequest<IDBCursorWithValue | null>;
    const makeCursor = (): IDBCursorWithValue | null => {
      const entry = entries[index];
      if (!entry) return null;
      const [key, value] = entry;
      const cursor = {
        value: { ...value },
        primaryKey: key,
        continue: () => {
          index += 1;
          this.transaction.request(() => {
            request.result = makeCursor();
            request.onsuccess?.({});
            return undefined;
          });
        },
        delete: () => this.delete(key),
      } as unknown as IDBCursorWithValue;
      return cursor;
    };
    request = this.transaction.request(makeCursor);
    return request;
  }

  index(name: string): FakeIndex {
    if (!this.data.indexes.includes(name)) throw new Error(`Missing index: ${name}`);
    return new FakeIndex(this.transaction, this.data);
  }
}

class FakeIndex {
  private readonly transaction: FakeTransaction;
  private readonly data: StoreData;

  constructor(transaction: FakeTransaction, data: StoreData) {
    this.transaction = transaction;
    this.data = data;
  }

  getAll(jobId: IDBValidKey): FakeRequest<Record<string, unknown>[]> {
    return this.transaction.request(() =>
      [...this.data.records.values()]
        .filter((record) => record.jobId === jobId)
        .map((record) => ({ ...record })),
    );
  }
}

class FakeDatabase {
  readonly stores = new Map<string, StoreData>();
  readonly objectStoreNames = { contains: (name: string) => this.stores.has(name) };
  onversionchange: (() => void) | null = null;

  createObjectStore(
    name: string,
    options: { keyPath: string; autoIncrement?: boolean },
  ): FakeObjectStore {
    const data: StoreData = {
      ...options,
      nextKey: 1,
      records: new Map(),
      indexes: [],
    };
    this.stores.set(name, data);
    return new FakeObjectStore(new FakeTransaction(this), data);
  }

  transaction(stores: string | string[]): FakeTransaction {
    const names = Array.isArray(stores) ? stores : [stores];
    for (const name of names) if (!this.stores.has(name)) throw new Error(`Missing store: ${name}`);
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
      (
        request as FakeRequest<FakeDatabase> & { onupgradeneeded?: (event: unknown) => void }
      ).onupgradeneeded?.({
        target: request,
      });
      request.onsuccess?.({});
    });
    return request;
  }
  seed(storeName: string, key: IDBValidKey, value: Record<string, unknown>): void {
    this.database.stores.get(storeName)?.records.set(key, { ...value });
  }
}

const fakeIndexedDB = new FakeIndexedDB();
(globalThis as typeof globalThis & { indexedDB: IDBFactory }).indexedDB =
  fakeIndexedDB as unknown as IDBFactory;

const day = 24 * 60 * 60 * 1_000;
const snapshot = (jobId: string, capturedAt: number, applicants = 1): JobSnapshotRecord => ({
  jobId,
  applicants,
  interviewed: 2,
  hired: 3,
  positions: 4,
  capturedAt,
});

const latestInsights = normalizeJobInsights({
  data: {
    jobAuthDetails: {
      opening: {
        job: { info: { id: 'job-latest' }, clientActivity: {} },
      },
    },
  },
}) as JobInsights;

beforeEach(async () => {
  expect(await clearAllLocalData()).toBe(true);
});

afterAll(async () => {
  const database = await openDatabase();
  database?.close();
});

describe('database retention', () => {
  test('deletes records older than 90 days but keeps the exact boundary', async () => {
    const now = Date.now();
    const originalNow = Date.now;
    Date.now = () => now;
    try {
      const boundary = now - 90 * day;
      await putJobSnapshot(snapshot('job-1', boundary - 1));
      await putJobSnapshot(snapshot('job-1', boundary));
      await putJobSnapshot(snapshot('job-1', now));
      await enforceHistoryRetention(now);

      expect((await listJobSnapshots('job-1')).map((record) => record.capturedAt)).toEqual([
        boundary,
        now,
      ]);
    } finally {
      Date.now = originalNow;
    }
  });

  test('keeps only the 100 newest snapshots for each job', async () => {
    const now = Date.now();
    for (let index = 0; index < 101; index += 1) {
      await putJobSnapshot(snapshot('job-1', now - index * 1_000, index));
      await putJobSnapshot(snapshot('job-2', now - index * 1_000, index + 1_000));
    }
    const snapshots = await listJobSnapshots('job-1');
    const otherJobSnapshots = await listJobSnapshots('job-2');
    expect(snapshots).toHaveLength(100);
    expect(otherJobSnapshots).toHaveLength(100);
    expect(snapshots[0]?.applicants).toBe(99);
    expect(snapshots.at(-1)?.applicants).toBe(0);
    expect(otherJobSnapshots[0]?.applicants).toBe(1_099);
    expect(otherJobSnapshots.at(-1)?.applicants).toBe(1_000);
  });

  test('retains newer records when enforcing the cap', async () => {
    const now = Date.now();
    for (let index = 0; index < 100; index += 1) {
      await putJobSnapshot(snapshot('job-1', now - (index + 1) * 1_000, index));
    }
    await putJobSnapshot(snapshot('job-1', now + day, 999));
    await enforceHistoryRetention(now);

    const snapshots = await listJobSnapshots('job-1');
    expect(snapshots).toHaveLength(100);
    expect(snapshots.at(-1)?.applicants).toBe(999);
    expect(snapshots.some((record) => record.applicants === 999)).toBe(true);
  });

  test('preserves append dedup and callback behavior', async () => {
    const now = Date.now();
    let callbackCalls = 0;
    expect(
      await appendJobSnapshotIfChanged(snapshot('job-1', now), 60_000, () => {
        callbackCalls += 1;
        return true;
      }),
    ).not.toBeNull();
    expect(
      await appendJobSnapshotIfChanged(snapshot('job-1', now + 1), 60_000, () => {
        callbackCalls += 1;
        return true;
      }),
    ).toBeNull();
    expect(callbackCalls).toBe(2);
  });
  test('rejects invalid snapshot timestamps before writing', async () => {
    const invalidTimes = [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      0,
      -1,
      1.5,
    ];
    for (const capturedAt of invalidTimes) {
      expect(await putJobSnapshot(snapshot('job-invalid', capturedAt))).toBeNull();
      expect(await appendJobSnapshotIfChanged(snapshot('job-invalid', capturedAt))).toBeNull();
    }
    expect(await listJobSnapshots('job-invalid')).toEqual([]);
    expect(await putJobSnapshot(snapshot('job-valid', 1))).not.toBeNull();
    expect(await appendJobSnapshotIfChanged(snapshot('job-valid', 2))).not.toBeNull();
  });
  test('retention removes legacy-invalid snapshot rows in one cursor pass', async () => {
    const now = Date.now();
    fakeIndexedDB.seed(DATABASE_STORES.jobSnapshots, 1_001, {
      ...snapshot('job-legacy', now),
    });
    fakeIndexedDB.seed(DATABASE_STORES.jobSnapshots, 1_002, {
      ...snapshot('job-legacy', 0),
    });
    fakeIndexedDB.seed(DATABASE_STORES.jobSnapshots, 1_003, {
      ...snapshot('', now),
    });
    fakeIndexedDB.seed(DATABASE_STORES.jobSnapshots, 1_004, {
      ...snapshot('job-legacy', Number.NaN),
    });

    expect(await enforceHistoryRetention(now)).toBe(true);
    expect((await listJobSnapshots('job-legacy')).map((record) => record.capturedAt)).toEqual([
      now,
    ]);
  });

  test('writes and reads the latest complete capture by normalized job ID', async () => {
    const record = {
      jobId: '~job-latest',
      capturedAt: Date.now(),
      insights: latestInsights,
    };
    expect(await putLatestJobCapture(record)).toBe(true);
    expect(await getLatestJobCapture('~job-latest')).toEqual({
      ...record,
      jobId: 'job-latest',
    });
  });

  test('rejects invalid latest captures and expires old records', async () => {
    expect(
      await putLatestJobCapture({
        jobId: '',
        capturedAt: Date.now(),
        insights: latestInsights,
      }),
    ).toBe(false);
    expect(
      await putLatestJobCapture({
        jobId: 'job-latest',
        capturedAt: Number.NaN,
        insights: latestInsights,
      }),
    ).toBe(false);
    expect(
      await putLatestJobCapture({
        jobId: 'job-other',
        capturedAt: Date.now(),
        insights: latestInsights,
      }),
    ).toBe(false);

    const old = Date.now() - 90 * day - 1;
    expect(
      await putLatestJobCapture({
        jobId: 'job-latest',
        capturedAt: old,
        insights: latestInsights,
      }),
    ).toBe(true);
    expect(await getLatestJobCapture('job-latest')).toBeNull();
  });
  test('rejects non-positive and fractional latest capture timestamps', async () => {
    for (const capturedAt of [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 0, -1, 1.5]) {
      expect(
        await putLatestJobCapture({
          jobId: 'job-latest',
          capturedAt,
          insights: latestInsights,
        }),
      ).toBe(false);
    }
    expect(await getLatestJobCapture('job-latest')).toBeNull();
  });

  test('honors latest capture write guards inside the transaction', async () => {
    let allowWrite = false;
    const record = {
      jobId: 'job-latest',
      capturedAt: Date.now(),
      insights: latestInsights,
    };

    expect(await putLatestJobCapture(record, () => allowWrite)).toBe(false);
    expect(await getLatestJobCapture('job-latest')).toBeNull();
    allowWrite = true;
    expect(await putLatestJobCapture(record, () => allowWrite)).toBe(true);
    expect(await getLatestJobCapture('job-latest')).not.toBeNull();
  });
});

describe('database clear APIs', () => {
  test('clearHistory removes jobs, snapshots, applications, and watchlist', async () => {
    await putJob({ jobId: 'job-1', job: {} as never, client: {} as never });
    await putJobSnapshot(snapshot('job-1', Date.now()));
    await putApplication({
      jobId: 'job-1',
      state: null,
      viewedAt: null,
      appliedAt: null,
      interviewedAt: null,
      hiredAt: null,
    });
    await putWatchlist({
      jobId: 'job-1',
      job: {} as never,
      latestSnapshotId: null,
      savedAt: Date.now(),
    });
    await putLatestJobCapture({
      jobId: 'job-latest',
      capturedAt: Date.now(),
      insights: latestInsights,
    });

    expect(await clearHistory()).toBe(true);
    expect(await clearHistory()).toBe(true);
    expect(await getJob('job-1')).toBeNull();
    expect(await getLatestJobCapture('job-latest')).toBeNull();
    expect(await listJobSnapshots('job-1')).toEqual([]);
    expect(await getApplication('job-1')).toBeNull();
    expect(await getWatchlist('job-1')).toBeNull();
  });

  test('merges application captures monotonically and honors write guards', async () => {
    await putApplication({
      jobId: 'job-1',
      state: 'applied',
      viewedAt: 1,
      appliedAt: 2,
      interviewedAt: null,
      hiredAt: null,
    });

    expect(
      await mergeApplication({
        jobId: 'job-1',
        state: null,
        viewedAt: 3,
        appliedAt: null,
        interviewedAt: null,
        hiredAt: null,
      }),
    ).toBe(true);
    expect(await getApplication('job-1')).toMatchObject({
      state: 'applied',
      viewedAt: 3,
      appliedAt: 2,
    });

    expect(
      await putApplication(
        {
          jobId: 'job-1',
          state: 'hired',
          viewedAt: 4,
          appliedAt: 4,
          interviewedAt: null,
          hiredAt: 4,
        },

        () => false,
      ),
    ).toBe(false);
    expect((await getApplication('job-1'))?.state).toBe('applied');
    await putApplication({
      jobId: 'job-2',
      state: 'invited',
      viewedAt: 5,
      appliedAt: null,
      interviewedAt: null,
      hiredAt: null,
    });
    expect((await listApplications()).map(({ jobId }) => jobId).sort()).toEqual(['job-1', 'job-2']);
  });
  test('rejects invalid application timestamps before writing', async () => {
    const valid = {
      jobId: 'job-invalid',
      state: null,
      viewedAt: 1,
      appliedAt: 2,
      interviewedAt: 3,
      hiredAt: 4,
    };
    for (const field of ['viewedAt', 'appliedAt', 'interviewedAt', 'hiredAt'] as const) {
      for (const value of [0, -1, 1.5, Number.NaN]) {
        const invalid = { ...valid, [field]: value };
        expect(await putApplication(invalid)).toBe(false);
        expect(await mergeApplication(invalid)).toBe(false);
      }
    }
    expect(await getApplication('job-invalid')).toBeNull();
  });

  test('degrades safely when IndexedDB is unavailable', async () => {
    const database = await openDatabase();
    database?.close();
    const original = (globalThis as typeof globalThis & { indexedDB?: IDBFactory }).indexedDB;
    Reflect.deleteProperty(globalThis, 'indexedDB');
    expect(await clearHistory()).toBe(false);
    expect(await clearAllLocalData()).toBe(false);
    (globalThis as typeof globalThis & { indexedDB?: IDBFactory }).indexedDB = original;
  });
});
