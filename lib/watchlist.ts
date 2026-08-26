import { clearStores, DATABASE_STORES, runTransaction } from './database';
import { isJobInsights, type JobInsights } from './insights';
import { normalizeJobId } from './job-page';
import type { WatchlistRecord } from './storage';

type Capture = JobInsights;

function snapshotReference(value: number | null | undefined): number | null | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  const { promise, resolve, reject } = Promise.withResolvers<T>();
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  return promise;
}

function captureRecord(
  capture: Capture | null | undefined,
  latestSnapshotId: number | null | undefined,
  savedAt: number,
  previous: WatchlistRecord | null,
): WatchlistRecord | null {
  if (!isJobInsights(capture)) return null;
  const jobId = normalizeJobId(capture.job.id);
  if (!jobId) return null;
  const snapshotId = snapshotReference(latestSnapshotId);
  return {
    jobId,
    job: { ...capture.job, id: jobId },
    latestSnapshotId: snapshotId === undefined ? (previous?.latestSnapshotId ?? null) : snapshotId,
    savedAt: previous?.savedAt ?? savedAt,
  };
}

/** Saves a naturally captured, normalized job; no network or polling is performed. */
export async function bookmarkJob(
  capture: Capture | null | undefined,
  latestSnapshotId?: number | null,
): Promise<boolean> {
  const jobId = normalizeJobId(capture?.job?.id);
  if (!jobId || !isJobInsights(capture)) return false;
  const result = await runTransaction(
    DATABASE_STORES.watchlist,
    'readwrite',
    async (transaction) => {
      const store = transaction.objectStore(DATABASE_STORES.watchlist);
      const previous = await requestResult<WatchlistRecord | undefined>(store.get(jobId));
      const record = captureRecord(capture, latestSnapshotId, Date.now(), previous ?? null);
      return record ? requestResult(store.put(record)).then(() => true) : false;
    },
  );
  return result === true;
}

/** Updates an existing bookmark from a naturally captured, normalized job. */
export async function updateWatchlistFromCapture(
  capture: Capture | null | undefined,
  latestSnapshotId?: number | null,
): Promise<boolean> {
  const jobId = normalizeJobId(capture?.job?.id);
  if (!jobId || !isJobInsights(capture)) return false;
  const result = await runTransaction(
    DATABASE_STORES.watchlist,
    'readwrite',
    async (transaction) => {
      const store = transaction.objectStore(DATABASE_STORES.watchlist);
      const previous = await requestResult<WatchlistRecord | undefined>(store.get(jobId));
      if (!previous) return false;
      const record = captureRecord(capture, latestSnapshotId, Date.now(), previous);
      return record ? requestResult(store.put(record)).then(() => true) : false;
    },
  );
  return result === true;
}

export async function getWatchlistedJob(
  jobId: string | null | undefined,
): Promise<WatchlistRecord | null> {
  const normalized = normalizeJobId(jobId);
  if (!normalized) return null;
  const result = await runTransaction(DATABASE_STORES.watchlist, 'readonly', (transaction) =>
    requestResult<WatchlistRecord | undefined>(
      transaction.objectStore(DATABASE_STORES.watchlist).get(normalized),
    ),
  );
  return result ?? null;
}

export async function removeWatchlistedJob(jobId: string | null | undefined): Promise<boolean> {
  const normalized = normalizeJobId(jobId);
  if (!normalized) return false;
  const result = await runTransaction(DATABASE_STORES.watchlist, 'readwrite', (transaction) =>
    requestResult(transaction.objectStore(DATABASE_STORES.watchlist).delete(normalized)).then(
      () => true,
    ),
  );
  return result === true;
}

export async function listWatchlistedJobs(): Promise<WatchlistRecord[]> {
  const result = await runTransaction(DATABASE_STORES.watchlist, 'readonly', (transaction) =>
    requestResult<WatchlistRecord[]>(transaction.objectStore(DATABASE_STORES.watchlist).getAll()),
  );
  return (result ?? []).sort(
    (left, right) => right.savedAt - left.savedAt || left.jobId.localeCompare(right.jobId),
  );
}

/** Clears only the IndexedDB watchlist store through the database clear API. */
export function clearWatchlist(): Promise<boolean> {
  return clearStores([DATABASE_STORES.watchlist]);
}

export const clearWatchlistData = clearWatchlist;

export const bookmarkWatchlist = bookmarkJob;
export const getWatchlistJob = getWatchlistedJob;
export const removeWatchlist = removeWatchlistedJob;
export const listWatchlist = listWatchlistedJobs;
export const bookmark = bookmarkJob;
export const get = getWatchlistedJob;
export const remove = removeWatchlistedJob;
export const list = listWatchlistedJobs;
