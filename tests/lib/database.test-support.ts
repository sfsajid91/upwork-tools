import { afterAll, beforeEach, expect } from 'bun:test';
import { clearAllLocalData, openDatabase } from '../../src/lib/database';
import { normalizeJobInsights, type JobInsights } from '../../src/lib/insights';
import type { JobSnapshotRecord } from '../../src/lib/storage';

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

export const fakeIndexedDB = new FakeIndexedDB();
(globalThis as typeof globalThis & { indexedDB: IDBFactory }).indexedDB =
  fakeIndexedDB as unknown as IDBFactory;

export const day = 24 * 60 * 60 * 1_000;
export const snapshot = (jobId: string, capturedAt: number, applicants = 1): JobSnapshotRecord => ({
  jobId,
  applicants,
  interviewed: 2,
  hired: 3,
  positions: 4,
  capturedAt,
});

export const latestInsights = normalizeJobInsights({
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
