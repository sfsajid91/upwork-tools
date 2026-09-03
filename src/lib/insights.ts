import { normalizeJobId } from './job-page';
import { type QualificationDetail, summarizeQualificationMatches } from './qualification';
import { deriveHiringWarnings } from './hiring-warnings';
import { restrictionLabels } from './restrictions';

export type ApplicationState = 'applied' | 'invited' | 'hired';
export type ViewerMode = 'authenticated' | 'visitor';
export type JobWarning = 'position-filled' | 'already-hired' | 'already-applied' | 'client-invited';

export interface SimilarJob {
  id: string | null;
  ciphertext: string | null;
  title: string | null;
  description: string | null;
  amount: number | null;
  currency: string | null;
  contractorTier: string | null;
  type: string | null;
  durationLabel: string | null;
  skills: string[];
}

export interface ClientHistoryEntry {
  id: string | null;
  title: string | null;
  type: string | null;
  amountPaid: number | null;
  feedbackScore: number | null;
  status: string | null;
  startedOn: string | null;
  hours?: number | null;
  hourlyRate?: number | null;
}

export interface JobInsights {
  viewerMode: ViewerMode;
  job: {
    id: string | null;
    title: string | null;
    description: string | null;
    status: string | null;
    type: string | null;
    postedOn: string | null;
    publishTime: string | null;
    workload: string | null;
    contractorTier: string | null;
    budgetAmount: number | null;
    budgetCurrency: string | null;
    hourlyBudgetMin: number | null;
    hourlyBudgetMax: number | null;
    duration: string | null;
    category: string | null;
    skills: string[];
    restrictions: string[];
  };
  activity: {
    exactProposals: number | null;
    interviewed: number | null;
    interviewRate: number | null;
    totalHired: number | null;
    positionsToHire: number | null;
    lastBuyerActivity: string | null;
  };
  client: {
    topClient: boolean | null;
    paymentVerified: boolean | null;
    country: string | null;
    city: string | null;
    totalAssignments: number | null;
    activeAssignments: number | null;
    hours: number | null;
    feedbackCount: number | null;
    rating: number | null;
    totalJobsWithHires: number | null;
    jobsPosted: number | null;
    hireRate: number | null;
    totalCharges: number | null;
    averageHourlyRate: number | null;
    memberSince: string | null;
  };
  fit: {
    qualificationsMatched: number | null;
    qualificationsTotal: number | null;
    qualificationDetails: QualificationDetail[] | null;
    freelancerHourlyRate: number | null;
    rateContext: number | null;
    applicationState: ApplicationState | null;
  };
  history: {
    recentJobs: ClientHistoryEntry[];
    relatedJobs: ClientHistoryEntry[];
  };
  similarJobs: SimilarJob[];
  warnings: JobWarning[];
}

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue | null {
  return typeof value === 'object' && value !== null ? (value as RecordValue) : null;
}

function valueAt(value: unknown, ...keys: string[]): unknown {
  let current = value;
  for (const key of keys) {
    const object = record(current);
    if (!object) return null;
    current = object[key];
  }
  return current;
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function nullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function nonNegativeInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function nullableBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const number = nullableNumber(value);
    if (number !== null) return number;
  }
  return null;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const string = nullableString(value);
    if (string !== null) return string;
  }
  return null;
}

function skillNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((skill) => {
    const name = nullableString(valueAt(skill, 'prefLabel'));
    return name ? [name] : [];
  });
}

function historyTimestamp(value: string | null): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeHistory(value: unknown): ClientHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .flatMap((entry) => {
      const entryObject = record(entry);
      const jobInfo = record(entryObject?.jobInfo);
      if (!entryObject || !jobInfo) return [];
      const feedback = record(entryObject.feedback);
      return [
        {
          id: firstString(jobInfo.ciphertext, jobInfo.id, jobInfo.uid),
          title: nullableString(jobInfo.title),
          type: nullableString(jobInfo.type),
          amountPaid: nullableNumber(entryObject.totalCharge),
          hourlyRate: nullableNumber(valueAt(entryObject, 'rate', 'amount')),
          hours: nullableNumber(entryObject.totalHours),
          feedbackScore: nullableNumber(feedback?.score),
          status: nullableString(entryObject.status),
          startedOn: nullableString(entryObject.startDate),
        },
      ];
    })
    .sort((left, right) => historyTimestamp(right.startedOn) - historyTimestamp(left.startedOn))
    .slice(0, 5);
}

const RELATED_TITLE_STOP_WORDS: Record<string, true> = {
  and: true,
  for: true,
  from: true,
  needed: true,
  with: true,
  the: true,
  this: true,
  that: true,
  job: true,
  senior: true,
  junior: true,
  lead: true,
  developer: true,
  engineer: true,
  manager: true,
  consultant: true,
  specialist: true,
  designer: true,
};
function titleTokens(title: string | null): Set<string> {
  if (!title) return new Set();
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 3 && !RELATED_TITLE_STOP_WORDS[token]),
  );
}

function relatedHistory(
  currentJobId: string | null,
  currentTitle: string | null,
  recentJobs: ClientHistoryEntry[],
): ClientHistoryEntry[] {
  const currentTokens = titleTokens(currentTitle);
  if (currentTokens.size === 0) return [];
  const threshold = currentTokens.size === 1 ? 1 : 2;
  return recentJobs
    .filter(
      (job) => currentJobId === null || normalizeJobId(job.id) !== normalizeJobId(currentJobId),
    )
    .filter((job) => {
      const matchingTokens = [...titleTokens(job.title)].filter((token) =>
        currentTokens.has(token),
      );
      return matchingTokens.length >= threshold;
    })
    .slice(0, 3);
}

function applicationState(freelancerInfo: RecordValue | null): ApplicationState | null {
  if (!freelancerInfo) return null;
  if (
    freelancerInfo.hired !== null &&
    freelancerInfo.hired !== undefined &&
    freelancerInfo.hired !== false
  )
    return 'hired';
  if (
    freelancerInfo.applied !== null &&
    freelancerInfo.applied !== undefined &&
    freelancerInfo.applied !== false
  )
    return 'applied';
  if (
    freelancerInfo.pendingInvite !== null &&
    freelancerInfo.pendingInvite !== undefined &&
    freelancerInfo.pendingInvite !== false
  )
    return 'invited';
  return null;
}
function normalizeSimilarJobs(value: unknown): SimilarJob[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const object = record(item);
    if (!object) return [];
    const amount = record(object.amount);
    return [
      {
        id: nullableString(object.id),
        ciphertext: nullableString(object.ciphertext),
        title: nullableString(object.title),
        description: nullableString(object.description),
        amount: nullableNumber(amount?.amount ?? object.amount),
        currency: nullableString(amount?.currencyCode ?? object.currencyCode),
        contractorTier: nullableString(object.contractorTier),
        type: nullableString(object.type),
        durationLabel: nullableString(object.durationLabel),
        skills: skillNames(object.ontologySkills),
      },
    ];
  });
}

export function normalizeJobInsights(payload: unknown): JobInsights | null {
  const payloadObject = record(payload);
  const data = record(payloadObject?.data);
  const authDetails = record(data?.jobAuthDetails ?? payloadObject?.jobAuthDetails);
  const pubDetails = record(data?.jobPubDetails ?? payloadObject?.jobPubDetails);
  if (!authDetails && !pubDetails) return null;

  const viewerMode: ViewerMode = authDetails ? 'authenticated' : 'visitor';
  const details = authDetails ?? pubDetails;
  if (!details) return null;
  const openingJob =
    record(valueAt(authDetails, 'opening', 'job')) ?? record(valueAt(pubDetails, 'opening'));
  const info = record(openingJob?.info);
  const budget = record(openingJob?.budget);
  const activity = record(openingJob?.clientActivity);
  const qualifications =
    record(valueAt(authDetails, 'opening', 'qualifications')) ??
    record(valueAt(pubDetails, 'qualifications'));
  const buyer = record(details.buyer);
  const buyerInfo = record(buyer?.info);
  const buyerStats = record(buyerInfo?.stats) ?? record(buyer?.stats);
  const buyerJobs = record(buyerInfo?.jobs) ?? record(buyer?.jobs);
  const buyerCompany = record(buyerInfo?.company) ?? record(buyer?.company);
  const location = record(buyerInfo?.location) ?? record(buyer?.location);
  const hourlyRate = record(buyerInfo?.avgHourlyJobsRate) ?? record(buyer?.avgHourlyJobsRate);
  const extendedBudget = record(openingJob?.extendedBudgetInfo);
  const freelancerInfo =
    viewerMode === 'authenticated'
      ? record(valueAt(details, 'currentUserInfo', 'freelancerInfo'))
      : null;
  const qualificationMatches = valueAt(freelancerInfo, 'qualificationsMatches', 'matches');
  const qualificationSummary = Array.isArray(qualificationMatches)
    ? summarizeQualificationMatches(qualificationMatches)
    : null;
  const recentJobs = normalizeHistory(
    valueAt(buyer, 'workHistory') ?? valueAt(details, 'workHistory'),
  );
  const currentJobId = firstString(
    info?.ciphertext,
    openingJob?.ciphertext,
    info?.uid,
    openingJob?.uid,
    info?.id,
    openingJob?.id,
  );
  const currentTitle = nullableString(info?.title);
  const currentStatus = nullableString(openingJob?.status);
  const exactProposals = nonNegativeInteger(activity?.totalApplicants);
  const interviewed = nonNegativeInteger(activity?.totalInvitedToInterview);
  const totalHired = nonNegativeInteger(activity?.totalHired);
  const positionsToHire = nonNegativeInteger(activity?.numberOfPositionsToHire);
  const clientAverageHourlyRate = firstNumber(hourlyRate?.amount);
  const freelancerHourlyRate = nullableNumber(valueAt(freelancerInfo, 'hourlyRate', 'amount'));
  const currentApplicationState = applicationState(freelancerInfo);
  const hiringWarnings = deriveHiringWarnings({
    status: currentStatus,
    totalHired,
    positionsToHire,
    applicationState: currentApplicationState,
  });
  const warnings: JobWarning[] = [];
  if (hiringWarnings.positionFilled) warnings.push('position-filled');
  if (hiringWarnings.currentUserHired) warnings.push('already-hired');
  if (hiringWarnings.currentUserApplied) warnings.push('already-applied');
  if (hiringWarnings.currentUserInvited) warnings.push('client-invited');
  const history = {
    recentJobs,
    relatedJobs: relatedHistory(currentJobId, currentTitle, recentJobs),
  };
  const jobsPosted = nullableNumber(buyerJobs?.postedCount);
  const totalJobsWithHires = nullableNumber(buyerStats?.totalJobsWithHires);
  const similarJobs = normalizeSimilarJobs(details.similarJobs);

  return {
    viewerMode,
    job: {
      id: currentJobId,
      title: currentTitle,
      description: nullableString(openingJob?.description),
      status: currentStatus,
      type: nullableString(info?.type),
      postedOn: nullableString(openingJob?.postedOn ?? info?.createdOn),
      publishTime: nullableString(openingJob?.publishTime),
      workload: nullableString(openingJob?.workload),
      contractorTier: nullableString(openingJob?.contractorTier),
      budgetAmount: nullableNumber(budget?.amount),
      budgetCurrency: nullableString(budget?.currencyCode),
      hourlyBudgetMin: nullableNumber(extendedBudget?.hourlyBudgetMin),
      hourlyBudgetMax: nullableNumber(extendedBudget?.hourlyBudgetMax),
      duration: nullableString(valueAt(openingJob, 'engagementDuration', 'label')),
      category: nullableString(valueAt(openingJob, 'category', 'name')),
      skills: skillNames(valueAt(openingJob, 'sandsData', 'ontologySkills')).concat(
        skillNames(valueAt(openingJob, 'sandsData', 'additionalSkills')),
      ),
      restrictions: restrictionLabels(qualifications),
    },
    activity: {
      exactProposals,
      interviewed,
      interviewRate:
        exactProposals !== null && exactProposals > 0 && interviewed !== null
          ? (interviewed / exactProposals) * 100
          : null,
      totalHired,
      positionsToHire,
      lastBuyerActivity: nullableString(activity?.lastBuyerActivity),
    },
    client: {
      topClient: nullableBoolean(details.topClient),
      paymentVerified: nullableBoolean(
        record(details.buyerExtra)?.isPaymentMethodVerified ??
          buyer?.isPaymentMethodVerified ??
          false,
      ),
      country: nullableString(location?.country),
      city: nullableString(location?.city),
      totalAssignments: nullableNumber(buyerStats?.totalAssignments),
      activeAssignments: nullableNumber(buyerStats?.activeAssignmentsCount),
      hours: nullableNumber(buyerStats?.hoursCount),
      feedbackCount: nullableNumber(buyerStats?.feedbackCount),
      rating: nullableNumber(buyerStats?.score),
      totalJobsWithHires,
      jobsPosted,
      hireRate:
        jobsPosted !== null && jobsPosted > 0 && totalJobsWithHires !== null
          ? (totalJobsWithHires / jobsPosted) * 100
          : null,
      totalCharges: nullableNumber(valueAt(buyerStats, 'totalCharges', 'amount')),
      averageHourlyRate: clientAverageHourlyRate,
      memberSince: nullableString(valueAt(buyerCompany, 'contractDate')),
    },
    fit: {
      qualificationsMatched: qualificationSummary?.matched ?? null,
      qualificationsTotal: qualificationSummary?.total ?? null,
      qualificationDetails: qualificationSummary?.details ?? null,
      freelancerHourlyRate: viewerMode === 'visitor' ? null : freelancerHourlyRate,
      rateContext:
        viewerMode === 'visitor' ||
        freelancerHourlyRate === null ||
        clientAverageHourlyRate === null ||
        clientAverageHourlyRate <= 0
          ? null
          : freelancerHourlyRate / clientAverageHourlyRate,
      applicationState: viewerMode === 'visitor' ? null : currentApplicationState,
    },
    history,
    similarJobs,
    warnings,
  };
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
