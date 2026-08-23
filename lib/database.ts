import type {
  ApplicationRecord,
  JobRecord,
  JobSnapshotRecord,
  WatchlistRecord,
} from './storage';

export const DATABASE_NAME = 'upwork-tools';
export const DATABASE_VERSION = 1;

export const DATABASE_STORES = {
  jobs: 'jobs',
  jobSnapshots: 'jobSnapshots',
  applications: 'applications',
  watchlist: 'watchlist',
} as const;

export type DatabaseStoreName = (typeof DATABASE_STORES)[keyof typeof DATABASE_STORES];

const ALL_STORES = Object.values(DATABASE_STORES) as DatabaseStoreName[];

type TransactionCallback<T> = (transaction: IDBTransaction) => Promise<T> | T;

let databasePromise: Promise<IDBDatabase | null> | null = null;

function indexedDb(): IDBFactory | null {
  return typeof globalThis.indexedDB === 'undefined' ? null : globalThis.indexedDB;
}

function hasJobId(value: unknown): value is { jobId: string } {
  if (typeof value !== 'object' || value === null || !('jobId' in value)) return false;
  const jobId = value.jobId;
  return typeof jobId === 'string' && jobId.trim().length > 0;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function createStore(
  database: IDBDatabase,
  transaction: IDBTransaction | null,
  name: DatabaseStoreName,
  options: IDBObjectStoreParameters,
): IDBObjectStore | null {
  if (!database.objectStoreNames.contains(name)) return database.createObjectStore(name, options);
  return transaction?.objectStore(name) ?? null;
}

/** Creates every store and index required by the current schema. Safe to call during upgrades. */
export function configureDatabaseSchema(
  database: IDBDatabase,
  transaction: IDBTransaction | null = null,
): void {
  createStore(database, transaction, DATABASE_STORES.jobs, { keyPath: 'jobId' });
  const snapshots = createStore(database, transaction, DATABASE_STORES.jobSnapshots, {
    keyPath: 'id',
    autoIncrement: true,
  });
  createStore(database, transaction, DATABASE_STORES.applications, { keyPath: 'jobId' });
  createStore(database, transaction, DATABASE_STORES.watchlist, { keyPath: 'jobId' });

  if (!snapshots) return;
  if (!snapshots.indexNames.contains('jobId')) snapshots.createIndex('jobId', 'jobId', { unique: false });
  if (!snapshots.indexNames.contains('capturedAt')) {
    snapshots.createIndex('capturedAt', 'capturedAt', { unique: false });
  }
}

function openDatabaseOnce(): Promise<IDBDatabase | null> {
  const factory = indexedDb();
  if (!factory) return Promise.resolve(null);

  return new Promise((resolve) => {
    let settled = false;
    let request: IDBOpenDBRequest;
    try {
      request = factory.open(DATABASE_NAME, DATABASE_VERSION);
    } catch {
      settled = true;
      databasePromise = null;
      resolve(null);
      return;
    }

    request.onupgradeneeded = () => {
      try {
        configureDatabaseSchema(request.result, request.transaction);
      } catch {
        request.transaction?.abort();
      }
    };
    request.onsuccess = () => {
      const database = request.result;
      if (settled) {
        database.close();
        return;
      }
      settled = true;
      database.onversionchange = () => {
        database.close();
        databasePromise = null;
      };
      resolve(database);
    };
    request.onerror = () => {
      if (!settled) {
        settled = true;
        databasePromise = null;
        resolve(null);
      }
    };
    request.onblocked = () => {
      if (!settled) {
        settled = true;
        databasePromise = null;
        resolve(null);
      }
    };
  });
}

/** Opens the versioned local database, or null when IndexedDB is unavailable or blocked. */
export function openDatabase(): Promise<IDBDatabase | null> {
  if (!databasePromise) databasePromise = openDatabaseOnce();
  return databasePromise;
}

/** Runs one transaction and degrades to null when IndexedDB cannot be used. */
export function runTransaction<T>(
  stores: DatabaseStoreName | DatabaseStoreName[],
  mode: IDBTransactionMode,
  callback: TransactionCallback<T>,
): Promise<T | null> {
  return openDatabase().then((database) => {
    if (!database) return null;

    return new Promise<T | null>((resolve) => {
      let transaction: IDBTransaction;
      try {
        transaction = database.transaction(stores, mode);
      } catch {
        resolve(null);
        return;
      }

      let callbackFinished = false;
      let callbackValue: T;
      let transactionFinished = false;
      let settled = false;

      const settle = () => {
        if (!settled && callbackFinished && transactionFinished) {
          settled = true;
          resolve(callbackValue);
        }
      };

      transaction.oncomplete = () => {
        transactionFinished = true;
        settle();
      };
      transaction.onerror = () => {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      };
      transaction.onabort = () => {
        if (!settled) {
          settled = true;
          resolve(null);
        }
      };

      try {
        Promise.resolve(callback(transaction)).then(
          (value) => {
            callbackValue = value;
            callbackFinished = true;
            settle();
          },
          () => {
            try {
              transaction.abort();
            } catch {
              // The transaction may already have completed.
            }
            if (!settled) {
              settled = true;
              resolve(null);
            }
          },
        );
      } catch {
        try {
          transaction.abort();
        } catch {
          // The transaction may already have completed.
        }
        resolve(null);
      }
    });
  });
}

export async function putJob(
  record: JobRecord | null | undefined,
  shouldWrite?: () => boolean,
): Promise<boolean> {
  if (!hasJobId(record)) return false;
  const result = await runTransaction(DATABASE_STORES.jobs, 'readwrite', (transaction) => {
    if (shouldWrite && !shouldWrite()) return null;
    return requestResult(transaction.objectStore(DATABASE_STORES.jobs).put(record));
  });
  return result !== null;
}

export async function getJob(jobId: string | null | undefined): Promise<JobRecord | null> {
  if (typeof jobId !== 'string' || jobId.trim().length === 0) return null;
  return runTransaction(DATABASE_STORES.jobs, 'readonly', (transaction) =>
    requestResult<JobRecord | undefined>(transaction.objectStore(DATABASE_STORES.jobs).get(jobId)),
  ).then((record) => record ?? null);
}

export async function putJobSnapshot(
  record: JobSnapshotRecord | null | undefined,
): Promise<number | null> {
  if (!hasJobId(record)) return null;
  const { id: _ignoredId, ...snapshot } = record;
  void _ignoredId;
  const result = await runTransaction(DATABASE_STORES.jobSnapshots, 'readwrite', (transaction) =>
    requestResult<IDBValidKey>(transaction.objectStore(DATABASE_STORES.jobSnapshots).add(snapshot)),
  );
  return typeof result === 'number' ? result : null;
}

/** Appends a snapshot unless its values match the last adjacent capture within the window. */
export async function appendJobSnapshotIfChanged(
  record: JobSnapshotRecord | null | undefined,
  windowMs = 60_000,
  shouldWrite?: () => boolean,
): Promise<number | null> {
  if (!hasJobId(record)) return null;
  const { id: _ignoredId, ...snapshot } = record;
  void _ignoredId;
  const result = await runTransaction(
    DATABASE_STORES.jobSnapshots,
    'readwrite',
    async (transaction) => {
      const store = transaction.objectStore(DATABASE_STORES.jobSnapshots);
      const snapshots = await requestResult<JobSnapshotRecord[]>(
        store.index('jobId').getAll(record.jobId),
      );
      if (shouldWrite && !shouldWrite()) return null;
      const previous = snapshots.at(-1);
      if (
        previous &&
        Math.abs(record.capturedAt - previous.capturedAt) <= windowMs &&
        previous.applicants === record.applicants &&
        previous.interviewed === record.interviewed &&
        previous.hired === record.hired &&
        previous.positions === record.positions
      ) {
        return null;
      }
      return requestResult<IDBValidKey>(store.add(snapshot));
    },
  );
  return typeof result === 'number' ? result : null;
}


export async function listJobSnapshots(jobId: string | null | undefined): Promise<JobSnapshotRecord[]> {
  if (typeof jobId !== 'string' || jobId.trim().length === 0) return [];
  const snapshots = await runTransaction(DATABASE_STORES.jobSnapshots, 'readonly', (transaction) =>
    requestResult<JobSnapshotRecord[]>(
      transaction.objectStore(DATABASE_STORES.jobSnapshots).index('jobId').getAll(jobId),
    ),
  );
  return (snapshots ?? []).sort((left, right) => {
    const capturedAt = left.capturedAt - right.capturedAt;
    if (capturedAt !== 0) return capturedAt;
    return (left.id ?? 0) - (right.id ?? 0);
  });
}

export async function putApplication(record: ApplicationRecord | null | undefined): Promise<boolean> {
  if (!hasJobId(record)) return false;
  const result = await runTransaction(DATABASE_STORES.applications, 'readwrite', (transaction) =>
    requestResult(transaction.objectStore(DATABASE_STORES.applications).put(record)),
  );
  return result !== null;
}

export async function getApplication(jobId: string | null | undefined): Promise<ApplicationRecord | null> {
  if (typeof jobId !== 'string' || jobId.trim().length === 0) return null;
  return runTransaction(DATABASE_STORES.applications, 'readonly', (transaction) =>
    requestResult<ApplicationRecord | undefined>(
      transaction.objectStore(DATABASE_STORES.applications).get(jobId),
    ),
  ).then((record) => record ?? null);
}

export async function putWatchlist(record: WatchlistRecord | null | undefined): Promise<boolean> {
  if (!hasJobId(record)) return false;
  const result = await runTransaction(DATABASE_STORES.watchlist, 'readwrite', (transaction) =>
    requestResult(transaction.objectStore(DATABASE_STORES.watchlist).put(record)),
  );
  return result !== null;
}

export async function getWatchlist(jobId: string | null | undefined): Promise<WatchlistRecord | null> {
  if (typeof jobId !== 'string' || jobId.trim().length === 0) return null;
  return runTransaction(DATABASE_STORES.watchlist, 'readonly', (transaction) =>
    requestResult<WatchlistRecord | undefined>(
      transaction.objectStore(DATABASE_STORES.watchlist).get(jobId),
    ),
  ).then((record) => record ?? null);
}

export async function clearStores(
  stores: DatabaseStoreName[] = ALL_STORES,
): Promise<boolean> {
  if (stores.length === 0) return true;
  const result = await runTransaction(stores, 'readwrite', (transaction) =>
    Promise.all(stores.map((store) => requestResult(transaction.objectStore(store).clear()))).then(
      () => true,
    ),
  );
  return result === true;
}
