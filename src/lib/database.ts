import {
  DATABASE_STORES,
  type DatabaseStoreName,
  iterateCursor,
  requestResult,
  runTransaction,
} from './database-core';
import { isJobInsights, type JobInsights } from './insights';
import { normalizeJobId } from './job-page';
import type {
  ApplicationRecord,
  JobRecord,
  JobSnapshotRecord,
  LatestJobCaptureRecord,
  WatchlistRecord,
} from './storage';
import { HISTORY_RETENTION_DAYS, MAX_SNAPSHOTS_PER_JOB } from './storage';
import { mergeApplicationRecords } from './tracker';

export {
  configureDatabaseSchema,
  DATABASE_NAME,
  DATABASE_STORES,
  DATABASE_VERSION,
  openDatabase,
  runTransaction,
} from './database-core';

const ALL_STORES = Object.values(DATABASE_STORES) as DatabaseStoreName[];
const HISTORY_STORES = [
  DATABASE_STORES.jobSnapshots,
  DATABASE_STORES.jobs,
  DATABASE_STORES.applications,
  DATABASE_STORES.watchlist,
  DATABASE_STORES.latestCaptures,
] as DatabaseStoreName[];

const DAY_MS = 24 * 60 * 60 * 1_000;

function hasJobId(value: unknown): value is { jobId: string } {
  if (typeof value !== 'object' || value === null || !('jobId' in value)) return false;
  const jobId = value.jobId;
  return typeof jobId === 'string' && jobId.trim().length > 0;
}
function isValidTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isValidNullableTimestamp(value: unknown): value is number | null {
  return value === null || isValidTimestamp(value);
}

function isValidApplicationRecord(value: unknown): value is ApplicationRecord {
  if (!hasJobId(value)) return false;
  const record = value as Partial<ApplicationRecord>;
  return (
    isValidNullableTimestamp(record.viewedAt) &&
    isValidNullableTimestamp(record.appliedAt) &&
    isValidNullableTimestamp(record.interviewedAt) &&
    isValidNullableTimestamp(record.hiredAt)
  );
}

function isValidJobSnapshotRecord(value: unknown): value is JobSnapshotRecord {
  if (!hasJobId(value) || !('capturedAt' in value)) return false;
  return isValidTimestamp(value.capturedAt);
}

async function enforceHistoryRetentionInTransaction(
  transaction: IDBTransaction,
  now: number,
): Promise<void> {
  const store = transaction.objectStore(DATABASE_STORES.jobSnapshots);
  const cutoff = now - HISTORY_RETENTION_DAYS * DAY_MS;
  const perJob = new Map<string, Array<{ capturedAt: number; key: IDBValidKey }>>();

  await iterateCursor(store.openCursor(), (cursor) => {
    const record = cursor.value;
    const key = cursor.primaryKey;
    if (!isValidJobSnapshotRecord(record) || record.capturedAt < cutoff) {
      cursor.delete();
      return;
    }
    const snapshots = perJob.get(record.jobId) ?? [];
    snapshots.push({ capturedAt: record.capturedAt, key });
    perJob.set(record.jobId, snapshots);
  });

  for (const snapshots of perJob.values()) {
    if (snapshots.length <= MAX_SNAPSHOTS_PER_JOB) continue;
    snapshots.sort((left, right) => {
      if (left.capturedAt !== right.capturedAt) return right.capturedAt - left.capturedAt;
      const leftKey = typeof left.key === 'number' ? left.key : 0;
      const rightKey = typeof right.key === 'number' ? right.key : 0;
      return rightKey - leftKey;
    });
    for (const excess of snapshots.slice(MAX_SNAPSHOTS_PER_JOB)) store.delete(excess.key);
  }
}

function viewerModeRank(mode: JobInsights['viewerMode']): number {
  return mode === 'authenticated' ? 2 : 1;
}

function isLatestJobCaptureRecord(value: unknown): value is LatestJobCaptureRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  const insights = record.insights;
  return (
    normalizeJobId(typeof record.jobId === 'string' ? record.jobId : null) === record.jobId &&
    normalizeJobId(insights && isJobInsights(insights) ? insights.job.id : null) === record.jobId &&
    isValidTimestamp(record.capturedAt) &&
    isJobInsights(insights)
  );
}

async function enforceLatestCaptureRetentionInTransaction(
  transaction: IDBTransaction,
  now: number,
): Promise<void> {
  const store = transaction.objectStore(DATABASE_STORES.latestCaptures);
  const cutoff = now - HISTORY_RETENTION_DAYS * DAY_MS;
  await iterateCursor(store.openCursor(), (cursor) => {
    const record = cursor.value;
    if (!isLatestJobCaptureRecord(record) || record.capturedAt < cutoff) cursor.delete();
  });
}

export async function putLatestJobCapture(
  record: LatestJobCaptureRecord | null | undefined,
  shouldWrite?: () => boolean,
): Promise<boolean> {
  if (
    typeof record !== 'object' ||
    record === null ||
    !isJobInsights(record.insights) ||
    !isValidTimestamp(record.capturedAt) ||
    (shouldWrite && !shouldWrite())
  ) {
    return false;
  }
  const jobId = normalizeJobId(record.jobId);
  if (!jobId || normalizeJobId(record.insights.job.id) !== jobId) return false;
  const result = await runTransaction(
    DATABASE_STORES.latestCaptures,
    'readwrite',
    async (transaction) => {
      if (shouldWrite && !shouldWrite()) return null;
      const store = transaction.objectStore(DATABASE_STORES.latestCaptures);
      const current = await requestResult<LatestJobCaptureRecord | undefined>(store.get(jobId));
      if (
        current &&
        isLatestJobCaptureRecord(current) &&
        viewerModeRank(current.insights.viewerMode) > viewerModeRank(record.insights.viewerMode)
      ) {
        return false;
      }
      await requestResult(store.put({ ...record, jobId }));
      await enforceLatestCaptureRetentionInTransaction(transaction, Date.now());
      return true;
    },
  );
  return result === true;
}

export async function getLatestJobCapture(
  jobId: string | null | undefined,
): Promise<LatestJobCaptureRecord | null> {
  const normalizedJobId = normalizeJobId(jobId);
  if (!normalizedJobId) return null;
  const record = await runTransaction(DATABASE_STORES.latestCaptures, 'readonly', (transaction) =>
    requestResult<LatestJobCaptureRecord | undefined>(
      transaction.objectStore(DATABASE_STORES.latestCaptures).get(normalizedJobId),
    ),
  );
  const cutoff = Date.now() - HISTORY_RETENTION_DAYS * DAY_MS;
  return record && isLatestJobCaptureRecord(record) && record.capturedAt >= cutoff ? record : null;
}

/** Removes records older than 90 days and keeps at most 100 snapshots per job. */
export async function enforceHistoryRetention(now = Date.now()): Promise<boolean> {
  const result = await runTransaction(
    [DATABASE_STORES.jobSnapshots, DATABASE_STORES.latestCaptures],
    'readwrite',
    async (transaction) => {
      const retentionNow = Number.isFinite(now) ? now : Date.now();
      await enforceHistoryRetentionInTransaction(transaction, retentionNow);
      await enforceLatestCaptureRetentionInTransaction(transaction, retentionNow);
      return true;
    },
  );
  return result === true;
}

export async function putJob(
  record: JobRecord | null | undefined,
  shouldWrite?: () => boolean,
): Promise<boolean> {
  if (!hasJobId(record)) return false;
  const result = await runTransaction(DATABASE_STORES.jobs, 'readwrite', async (transaction) => {
    if (shouldWrite && !shouldWrite()) return null;
    const store = transaction.objectStore(DATABASE_STORES.jobs);
    const current = await requestResult<JobRecord | undefined>(store.get(record.jobId));
    if (current?.viewerMode === 'authenticated' && record.viewerMode === 'visitor') return false;
    return requestResult(store.put(record));
  });
  return result !== null && result !== false;
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
  if (!isValidJobSnapshotRecord(record)) return null;
  const { id: _ignoredId, ...snapshot } = record;
  void _ignoredId;
  const result = await runTransaction(
    DATABASE_STORES.jobSnapshots,
    'readwrite',
    async (transaction) => {
      const store = transaction.objectStore(DATABASE_STORES.jobSnapshots);
      const key = await requestResult<IDBValidKey>(store.add(snapshot));
      await enforceHistoryRetentionInTransaction(transaction, Date.now());
      return key;
    },
  );
  return typeof result === 'number' ? result : null;
}

/** Appends a snapshot unless its values match the last adjacent capture within the window. */
export async function appendJobSnapshotIfChanged(
  record: JobSnapshotRecord | null | undefined,
  windowMs = 60_000,
  shouldWrite?: () => boolean,
): Promise<number | null> {
  if (!isValidJobSnapshotRecord(record)) return null;
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
      const key = await requestResult<IDBValidKey>(store.add(snapshot));
      await enforceHistoryRetentionInTransaction(transaction, Date.now());
      return key;
    },
  );
  return typeof result === 'number' ? result : null;
}

export async function listJobSnapshots(
  jobId: string | null | undefined,
): Promise<JobSnapshotRecord[]> {
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

export async function putApplication(
  record: ApplicationRecord | null | undefined,
  shouldWrite?: () => boolean,
): Promise<boolean> {
  if (!isValidApplicationRecord(record) || (shouldWrite && !shouldWrite())) return false;
  const result = await runTransaction(
    DATABASE_STORES.applications,
    'readwrite',
    async (transaction) => {
      if (shouldWrite && !shouldWrite()) return false;
      await requestResult(transaction.objectStore(DATABASE_STORES.applications).put(record));
      return true;
    },
  );
  return result === true;
}

/**
 * Merges one observed application capture in the same readwrite transaction
 * that stores it, preventing concurrent captures from regressing state.
 */
export async function mergeApplication(
  record: ApplicationRecord | null | undefined,
  shouldWrite?: () => boolean,
): Promise<boolean> {
  if (!isValidApplicationRecord(record) || (shouldWrite && !shouldWrite())) return false;
  const result = await runTransaction(
    DATABASE_STORES.applications,
    'readwrite',
    async (transaction) => {
      if (shouldWrite && !shouldWrite()) return false;
      const store = transaction.objectStore(DATABASE_STORES.applications);
      const current = await requestResult<ApplicationRecord | undefined>(store.get(record.jobId));
      if (shouldWrite && !shouldWrite()) return false;
      await requestResult(store.put(current ? mergeApplicationRecords(current, record) : record));
      return true;
    },
  );
  return result === true;
}

export async function getApplication(
  jobId: string | null | undefined,
): Promise<ApplicationRecord | null> {
  if (typeof jobId !== 'string' || jobId.trim().length === 0) return null;
  return runTransaction(DATABASE_STORES.applications, 'readonly', (transaction) =>
    requestResult<ApplicationRecord | undefined>(
      transaction.objectStore(DATABASE_STORES.applications).get(jobId),
    ),
  ).then((record) => (isValidApplicationRecord(record) ? record : null));
}
export async function listApplications(): Promise<ApplicationRecord[]> {
  const records = await runTransaction(DATABASE_STORES.applications, 'readonly', (transaction) =>
    requestResult<ApplicationRecord[]>(
      transaction.objectStore(DATABASE_STORES.applications).getAll(),
    ),
  );
  return (records ?? []).filter(isValidApplicationRecord);
}

export async function putWatchlist(record: WatchlistRecord | null | undefined): Promise<boolean> {
  if (!hasJobId(record)) return false;
  const result = await runTransaction(DATABASE_STORES.watchlist, 'readwrite', (transaction) =>
    requestResult(transaction.objectStore(DATABASE_STORES.watchlist).put(record)),
  );
  return result !== null;
}

export async function getWatchlist(
  jobId: string | null | undefined,
): Promise<WatchlistRecord | null> {
  if (typeof jobId !== 'string' || jobId.trim().length === 0) return null;
  return runTransaction(DATABASE_STORES.watchlist, 'readonly', (transaction) =>
    requestResult<WatchlistRecord | undefined>(
      transaction.objectStore(DATABASE_STORES.watchlist).get(jobId),
    ),
  ).then((record) => record ?? null);
}

export async function clearStores(stores: DatabaseStoreName[] = ALL_STORES): Promise<boolean> {
  if (stores.length === 0) return true;
  const result = await runTransaction(stores, 'readwrite', (transaction) =>
    Promise.all(stores.map((store) => requestResult(transaction.objectStore(store).clear()))).then(
      () => true,
    ),
  );
  return result === true;
}

/** Clears locally persisted history and the job state that refers to it. */
export function clearHistory(): Promise<boolean> {
  return clearStores(HISTORY_STORES);
}

/** Clears every IndexedDB store owned by this extension. */
export function clearAllLocalData(): Promise<boolean> {
  return clearStores(ALL_STORES);
}
