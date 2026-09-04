import type { ClientHistoryEntry, JobInsights, JobWarning, SimilarJob } from './insights';
import type { QualificationDetail } from './qualification';

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue | null {
  return typeof value === 'object' && value !== null ? (value as RecordValue) : null;
}

function isNullableStringValue(key: string, source: RecordValue): boolean {
  return source[key] === null || typeof source[key] === 'string';
}

function isNullableNumberValue(key: string, source: RecordValue): boolean {
  return source[key] === null || (typeof source[key] === 'number' && Number.isFinite(source[key]));
}

function isNullableBooleanValue(key: string, source: RecordValue): boolean {
  return source[key] === null || typeof source[key] === 'boolean';
}

function isHistoryEntry(value: unknown): value is ClientHistoryEntry {
  const entry = record(value);
  if (!entry) return false;
  return (
    ['id', 'title', 'type', 'status', 'startedOn'].every((key) =>
      isNullableStringValue(key, entry),
    ) &&
    ['amountPaid', 'feedbackScore'].every((key) => isNullableNumberValue(key, entry)) &&
    ['hours', 'hourlyRate'].every(
      (key) => entry[key] === undefined || isNullableNumberValue(key, entry),
    )
  );
}

function isQualificationDetail(value: unknown): value is QualificationDetail {
  const detail = record(value);
  return (
    detail !== null &&
    typeof detail.requirementName === 'string' &&
    typeof detail.clientLabel === 'string' &&
    (detail.freelancerValue === null || typeof detail.freelancerValue === 'string') &&
    (detail.freelancerLabel === null || typeof detail.freelancerLabel === 'string') &&
    typeof detail.matched === 'boolean'
  );
}
function isSimilarJob(value: unknown): value is SimilarJob {
  const job = record(value);
  if (!job || !Array.isArray(job.skills)) return false;
  return (
    [
      'id',
      'ciphertext',
      'title',
      'description',
      'currency',
      'contractorTier',
      'type',
      'durationLabel',
    ].every((key) => isNullableStringValue(key, job)) &&
    isNullableNumberValue('amount', job) &&
    job.skills.every((skill) => typeof skill === 'string')
  );
}

export function isJobInsights(value: unknown): value is JobInsights {
  const object = record(value);
  const job = record(object?.job);
  const activity = record(object?.activity);
  const client = record(object?.client);
  const fit = record(object?.fit);
  const history = record(object?.history);
  const similarJobs = object?.similarJobs;
  const warnings = object?.warnings;
  if (
    !object ||
    (object.viewerMode !== 'authenticated' && object.viewerMode !== 'visitor') ||
    !job ||
    !activity ||
    !client ||
    !fit ||
    !history ||
    !Array.isArray(job.skills) ||
    !Array.isArray(job.restrictions) ||
    !Array.isArray(history.recentJobs) ||
    !Array.isArray(history.relatedJobs) ||
    !Array.isArray(similarJobs) ||
    !Array.isArray(warnings)
  ) {
    return false;
  }

  return (
    job.skills.every((skill) => typeof skill === 'string') &&
    job.restrictions.every((restriction) => typeof restriction === 'string') &&
    history.recentJobs.every(isHistoryEntry) &&
    history.relatedJobs.every(isHistoryEntry) &&
    similarJobs.every(isSimilarJob) &&
    warnings.every((warning): warning is JobWarning =>
      ['position-filled', 'already-hired', 'already-applied', 'client-invited'].includes(
        warning as string,
      ),
    ) &&
    [
      'id',
      'title',
      'description',
      'status',
      'type',
      'postedOn',
      'publishTime',
      'workload',
      'contractorTier',
      'budgetCurrency',
      'duration',
      'category',
    ].every((key) => isNullableStringValue(key, job)) &&
    ['budgetAmount', 'hourlyBudgetMin', 'hourlyBudgetMax'].every((key) =>
      isNullableNumberValue(key, job),
    ) &&
    ['exactProposals', 'interviewed', 'interviewRate', 'totalHired', 'positionsToHire'].every(
      (key) => isNullableNumberValue(key, activity),
    ) &&
    isNullableStringValue('lastBuyerActivity', activity) &&
    ['topClient', 'paymentVerified'].every((key) => isNullableBooleanValue(key, client)) &&
    ['country', 'city', 'memberSince'].every((key) => isNullableStringValue(key, client)) &&
    [
      'totalAssignments',
      'activeAssignments',
      'hours',
      'feedbackCount',
      'rating',
      'totalJobsWithHires',
      'jobsPosted',
      'hireRate',
      'totalCharges',
      'averageHourlyRate',
    ].every((key) => isNullableNumberValue(key, client)) &&
    ['qualificationsMatched', 'qualificationsTotal', 'freelancerHourlyRate', 'rateContext'].every(
      (key) => isNullableNumberValue(key, fit),
    ) &&
    (fit.qualificationDetails === null ||
      (Array.isArray(fit.qualificationDetails) &&
        fit.qualificationDetails.every(isQualificationDetail))) &&
    (fit.applicationState === null ||
      fit.applicationState === 'applied' ||
      fit.applicationState === 'invited' ||
      fit.applicationState === 'hired')
  );
}
