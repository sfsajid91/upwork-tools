import type { ApplicationRecord } from './storage';

export interface ConversionStats {
  applications: number;
  interviews: number;
  hires: number;
  applyToInterviewRate: number | null;
  applyToInterviewDenominator: number;
  interviewToHireRate: number | null;
  interviewToHireDenominator: number;
}

/** Aggregates factual tracker states without inferring missing transitions. */
export function aggregateConversionStats(
  records: readonly ApplicationRecord[] | null | undefined,
): ConversionStats {
  let applications = 0;
  let interviews = 0;
  let hires = 0;

  for (const record of records ?? []) {
    if (
      (typeof record.appliedAt === 'number' &&
        Number.isInteger(record.appliedAt) &&
        record.appliedAt > 0) ||
      record.state === 'applied'
    ) {
      applications += 1;
    }
    if (
      typeof record.interviewedAt === 'number' &&
      Number.isInteger(record.interviewedAt) &&
      record.interviewedAt > 0
    )
      interviews += 1;
    if (
      (typeof record.hiredAt === 'number' &&
        Number.isInteger(record.hiredAt) &&
        record.hiredAt > 0) ||
      record.state === 'hired'
    )
      hires += 1;
  }

  return {
    applications,
    interviews,
    hires,
    applyToInterviewRate: applications > 0 ? (interviews / applications) * 100 : null,
    applyToInterviewDenominator: applications,
    interviewToHireRate: interviews > 0 ? (hires / interviews) * 100 : null,
    interviewToHireDenominator: interviews,
  };
}
