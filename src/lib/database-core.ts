export const DATABASE_NAME = 'upwork-tools';
export const DATABASE_VERSION = 2;

export const DATABASE_STORES = {
  jobs: 'jobs',
  jobSnapshots: 'jobSnapshots',
  applications: 'applications',
  watchlist: 'watchlist',
  latestCaptures: 'latestCaptures',
} as const;

export type DatabaseStoreName = (typeof DATABASE_STORES)[keyof typeof DATABASE_STORES];

let databaseFactory: IDBFactory | null = null;
let databasePromise: Promise<IDBDatabase | null> | null = null;

type TransactionCallback<T> = (transaction: IDBTransaction) => Promise<T> | T;

function indexedDb(): IDBFactory | null {
  return typeof globalThis.indexedDB === 'undefined' ? null : globalThis.indexedDB;
}

export function requestResult<T>(request: IDBRequest<T>): Promise<T> {
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
  createStore(database, transaction, DATABASE_STORES.latestCaptures, { keyPath: 'jobId' });

  if (!snapshots) return;
  if (!snapshots.indexNames.contains('jobId'))
    snapshots.createIndex('jobId', 'jobId', { unique: false });
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
  const factory = indexedDb();
  if (!factory) return Promise.resolve(null);
  if (databaseFactory !== factory) {
    databaseFactory = factory;
    databasePromise = null;
  }
  if (!databasePromise) databasePromise = openDatabaseOnce();
  return databasePromise.then((database) => {
    if (!database) databasePromise = null;
    return database;
  });
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
export function iterateCursor(
  request: IDBRequest<IDBCursorWithValue | null>,
  onCursor: (cursor: IDBCursorWithValue) => void,
): Promise<void> {
  const { promise, resolve, reject } = Promise.withResolvers<void>();
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      resolve();
      return;
    }
    try {
      onCursor(cursor);
      cursor.continue();
    } catch (error) {
      reject(error);
    }
  };
  request.onerror = () => reject(request.error ?? new Error('Cursor iteration failed'));
  return promise;
}
