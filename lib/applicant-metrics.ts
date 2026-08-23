export interface ApplicantSnapshot {
  applicants: number | null;
  capturedAt: number;
}

export interface ApplicantMetrics {
  latestApplicantCount: number | null;
  firstSeenDelta: number | null;
  recentDelta: number | null;
}

function isValidCount(value: number | null): value is number {
  return value === null || (Number.isFinite(value) && value >= 0);
}

function hasValidOrder(snapshots: readonly ApplicantSnapshot[]): boolean {
  for (let index = 0; index < snapshots.length; index += 1) {
    const snapshot = snapshots[index];
    const previous = index > 0 ? snapshots[index - 1] : undefined;
    if (
      !snapshot ||
      !Number.isFinite(snapshot.capturedAt) ||
      !isValidCount(snapshot.applicants) ||
      (previous !== undefined && snapshot.capturedAt < previous.capturedAt)
    ) {
      return false;
    }
  }
  return true;
}

function validSnapshots(
  snapshots: readonly ApplicantSnapshot[],
): readonly ApplicantSnapshot[] | null {
  return snapshots.length > 0 && hasValidOrder(snapshots) ? snapshots : null;
}

/** Returns the applicant count from the newest ordered snapshot. */
export function latestApplicantCount(snapshots: readonly ApplicantSnapshot[]): number | null {
  const valid = validSnapshots(snapshots);
  const latest = valid?.[valid.length - 1];
  return latest?.applicants ?? null;
}

/** Returns the change from the first observed count to the newest count. */
export function firstSeenApplicantDelta(snapshots: readonly ApplicantSnapshot[]): number | null {
  const valid = validSnapshots(snapshots);
  if (!valid || valid.length < 2) return null;

  const first = valid[0];
  const latest = valid[valid.length - 1];
  if (!first || !latest || first.applicants === null || latest.applicants === null) return null;
  return latest.applicants - first.applicants;
}

/** Returns the change between the newest snapshot and its immediate predecessor. */
export function recentApplicantDelta(snapshots: readonly ApplicantSnapshot[]): number | null {
  const valid = validSnapshots(snapshots);
  if (!valid || valid.length < 2) return null;

  const previous = valid[valid.length - 2];
  const latest = valid[valid.length - 1];
  if (!previous || !latest || previous.applicants === null || latest.applicants === null)
    return null;
  return latest.applicants - previous.applicants;
}

/** Derives factual applicant metrics without sorting, filling, or inventing values. */
export function deriveApplicantMetrics(snapshots: readonly ApplicantSnapshot[]): ApplicantMetrics {
  return {
    latestApplicantCount: latestApplicantCount(snapshots),
    firstSeenDelta: firstSeenApplicantDelta(snapshots),
    recentDelta: recentApplicantDelta(snapshots),
  };
}
