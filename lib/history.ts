import type { JobSnapshotRecord } from './storage';

/** A deterministic view of one job's valid capture history. */
export interface JobSnapshotSummary {
  snapshots: JobSnapshotRecord[];
  latest: JobSnapshotRecord | null;
  firstSeen: JobSnapshotRecord | null;
  /** The two most recent captures, in capture-time order. */
  recent: JobSnapshotRecord[];
  previous: JobSnapshotRecord | null;
}

function validJobId(jobId: unknown): jobId is string {
  return typeof jobId === 'string' && jobId.trim().length > 0;
}

function validSnapshot(value: unknown, jobId: string): value is JobSnapshotRecord {
  if (typeof value !== 'object' || value === null) return false;
  const snapshot = value as Partial<JobSnapshotRecord>;
  return snapshot.jobId === jobId && typeof snapshot.capturedAt === 'number' && Number.isFinite(snapshot.capturedAt);
}

function compareSnapshots(left: JobSnapshotRecord, right: JobSnapshotRecord): number {
  const capturedAt = left.capturedAt - right.capturedAt;
  if (capturedAt !== 0) return capturedAt;
  return (left.id ?? 0) - (right.id ?? 0);
}

/** Returns valid snapshots for a job without mutating the caller's array. */
export function queryJobSnapshots(
  snapshots: readonly JobSnapshotRecord[] | null | undefined,
  jobId: string | null | undefined,
): JobSnapshotRecord[] {
  if (!validJobId(jobId) || !Array.isArray(snapshots)) return [];
  return snapshots.filter((snapshot) => validSnapshot(snapshot, jobId)).sort(compareSnapshots);
}

/** Summarizes a caller-provided snapshot list; no storage or network access occurs here. */
export function summarizeJobSnapshots(
  snapshots: readonly JobSnapshotRecord[] | null | undefined,
  jobId: string | null | undefined,
): JobSnapshotSummary | null {
  const ordered = queryJobSnapshots(snapshots, jobId);
  if (ordered.length === 0) return null;
  const latest = ordered.at(-1) ?? null;
  const firstSeen = ordered.at(0) ?? null;
  const previous = ordered.at(-2) ?? null;
  return {
    snapshots: ordered,
    latest,
    firstSeen,
    recent: ordered.slice(-2),
    previous,
  };
}

export const listValidJobSnapshots = queryJobSnapshots;
export const getJobSnapshotSummary = summarizeJobSnapshots;
