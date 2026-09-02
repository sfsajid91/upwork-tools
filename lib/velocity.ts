export const MIN_PROPOSAL_VELOCITY_INTERVAL_MS = 3_600_000;

/** A timestamp accepted by proposal velocity calculations. Numeric values are milliseconds since epoch. */
export type VelocityTimestamp = number | string | Date | null | undefined;

function timestampMs(value: VelocityTimestamp): number | null {
  const milliseconds =
    value instanceof Date
      ? value.getTime()
      : typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Date.parse(value)
          : Number.NaN;
  return Number.isFinite(milliseconds) ? milliseconds : null;
}

/**
 * Returns the factual change in applicants per elapsed hour, or null when the
 * observations cannot produce a valid interval.
 */
export function calculateProposalVelocity(
  previousApplicants: number | null | undefined,
  latestApplicants: number | null | undefined,
  previousTimestamp: VelocityTimestamp,
  latestTimestamp: VelocityTimestamp,
): number | null {
  if (
    typeof previousApplicants !== 'number' ||
    typeof latestApplicants !== 'number' ||
    !Number.isFinite(previousApplicants) ||
    !Number.isFinite(latestApplicants) ||
    previousApplicants < 0 ||
    latestApplicants < 0
  ) {
    return null;
  }

  const previousMs = timestampMs(previousTimestamp);
  const latestMs = timestampMs(latestTimestamp);
  if (previousMs === null || latestMs === null || latestMs <= previousMs) return null;

  const elapsedHours = (latestMs - previousMs) / MIN_PROPOSAL_VELOCITY_INTERVAL_MS;
  if (!Number.isFinite(elapsedHours) || latestMs - previousMs < MIN_PROPOSAL_VELOCITY_INTERVAL_MS)
    return null;

  return Number(((latestApplicants - previousApplicants) / elapsedHours).toFixed(1));
}

/** Formats a velocity without implying whether it is desirable. */
export function formatProposalVelocity(value: number | null): string {
  return value === null ? 'Not available' : `${value.toFixed(1)} applicants/hour`;
}
