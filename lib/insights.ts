export type ApplicationState = 'applied' | 'invited' | 'hired';
export type JobWarning = 'position-filled' | 'already-hired' | 'already-applied' | 'client-invited';

export interface ClientHistoryEntry {
  id: string | null;
  title: string | null;
  type: string | null;
  amountPaid: number | null;
  feedbackScore: number | null;
  status: string | null;
  startedOn: string | null;
}

export interface JobInsights {
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
    freelancerHourlyRate: number | null;
    rateContext: number | null;
    applicationState: ApplicationState | null;
  };
  history: {
    recentJobs: ClientHistoryEntry[];
    relatedJobs: ClientHistoryEntry[];
  };
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

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function labels(value: unknown): string[] {
  if (typeof value === 'string') return value.length > 0 ? [value] : [];
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item === 'string') return item.length > 0 ? [item] : [];
    return [
      firstString(
        valueAt(item, 'name'),
        valueAt(item, 'label'),
        valueAt(item, 'value'),
        valueAt(item, 'country'),
        valueAt(item, 'state'),
      ),
    ].filter((label): label is string => label !== null);
  });
}

function restrictionLabels(qualifications: RecordValue | null): string[] {
  if (!qualifications) return [];
  const restrictions = [
    ...labels(qualifications.countries).map((value) => value),
    ...labels(qualifications.states).map((value) => value),
    ...labels(qualifications.timezones).map((value) => value),
  ];
  const minimumJobSuccessScore = nullableNumber(qualifications.minJobSuccessScore);
  if (minimumJobSuccessScore !== null && minimumJobSuccessScore > 0) {
    restrictions.push(`${minimumJobSuccessScore}%+ JSS`);
  }
  const englishSkill = nullableString(qualifications.prefEnglishSkill);
  if (englishSkill && englishSkill !== 'ANY') restrictions.push(`English: ${englishSkill}`);
  if (qualifications.shouldHavePortfolio === true) restrictions.push('Portfolio required');
  if (qualifications.readyToStartToday === true) restrictions.push('Ready to start today');
  return uniqueStrings(restrictions);
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
          id: firstString(jobInfo.id, jobInfo.uid),
          title: nullableString(jobInfo.title),
          type: nullableString(jobInfo.type),
          amountPaid: nullableNumber(entryObject.totalCharge),
          feedbackScore: nullableNumber(feedback?.score),
          status: nullableString(entryObject.status),
          startedOn: nullableString(entryObject.startDate),
        },
      ];
    })
    .sort((left, right) => {
      const leftTime = left.startedOn ? Date.parse(left.startedOn) : 0;
      const rightTime = right.startedOn ? Date.parse(right.startedOn) : 0;
      return rightTime - leftTime;
    })
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
};

function titleTokens(title: string | null): Set<string> {
  if (!title) return new Set();
  return new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length >= 4 && !RELATED_TITLE_STOP_WORDS[token]),
  );
}

function relatedHistory(
  currentTitle: string | null,
  recentJobs: ClientHistoryEntry[],
): ClientHistoryEntry[] {
  const currentTokens = titleTokens(currentTitle);
  if (currentTokens.size === 0) return [];
  const threshold = currentTokens.size === 1 ? 1 : 2;
  return recentJobs
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

function warningLabels(
  status: string | null,
  currentApplicationState: ApplicationState | null,
): JobWarning[] {
  const warnings: JobWarning[] = [];
  if (status?.toUpperCase() === 'FILLED') warnings.push('position-filled');
  if (currentApplicationState === 'hired') warnings.push('already-hired');
  if (currentApplicationState === 'applied') warnings.push('already-applied');
  if (currentApplicationState === 'invited') warnings.push('client-invited');
  return warnings;
}

export function normalizeJobInsights(payload: unknown): JobInsights | null {
  const payloadObject = record(payload);
  const data = record(payloadObject?.data);
  const details = record(data?.jobAuthDetails ?? payloadObject?.jobAuthDetails);
  if (!details) return null;

  const job = record(valueAt(details, 'opening', 'job'));
  const info = record(valueAt(job, 'info'));
  const budget = record(valueAt(job, 'budget'));
  const activity = record(valueAt(job, 'clientActivity'));
  const qualifications = record(valueAt(details, 'opening', 'qualifications'));
  const buyer = record(valueAt(details, 'buyer'));
  const buyerInfo = record(valueAt(buyer, 'info'));
  const buyerStats = record(valueAt(buyerInfo, 'stats'));
  const buyerJobs = record(valueAt(buyerInfo, 'jobs'));
  const buyerCompany = record(valueAt(buyerInfo, 'company'));
  const location = record(valueAt(buyerInfo, 'location'));
  const hourlyRate = record(valueAt(buyerInfo, 'avgHourlyJobsRate'));
  const extendedBudget = record(valueAt(job, 'extendedBudgetInfo'));
  const freelancerInfo = record(valueAt(details, 'currentUserInfo', 'freelancerInfo'));
  const qualificationMatches = valueAt(freelancerInfo, 'qualificationsMatches', 'matches');
  const recentJobs = normalizeHistory(valueAt(details, 'workHistory'));
  const currentTitle = nullableString(info?.title);
  const currentStatus = nullableString(job?.status);
  const exactProposals = nullableNumber(activity?.totalApplicants);
  const interviewed = nullableNumber(activity?.totalInvitedToInterview);
  const clientAverageHourlyRate = firstNumber(hourlyRate?.amount);
  const freelancerHourlyRate = nullableNumber(valueAt(freelancerInfo, 'hourlyRate', 'amount'));
  const currentApplicationState = applicationState(freelancerInfo);
  const matches = Array.isArray(qualificationMatches) ? qualificationMatches : [];
  const qualifiedMatches = matches.filter((match) => valueAt(match, 'qualified') === true).length;
  const hasQualificationMatches = Array.isArray(qualificationMatches);
  const history = {
    recentJobs,
    relatedJobs: relatedHistory(currentTitle, recentJobs),
  };

  return {
    job: {
      id: nullableString(info?.id),
      title: currentTitle,
      description: nullableString(job?.description),
      status: currentStatus,
      type: nullableString(info?.type),
      postedOn: nullableString(job?.postedOn ?? info?.createdOn),
      publishTime: nullableString(job?.publishTime),
      workload: nullableString(job?.workload),
      contractorTier: nullableString(job?.contractorTier),
      budgetAmount: nullableNumber(budget?.amount),
      budgetCurrency: nullableString(budget?.currencyCode),
      hourlyBudgetMin: nullableNumber(extendedBudget?.hourlyBudgetMin),
      hourlyBudgetMax: nullableNumber(extendedBudget?.hourlyBudgetMax),
      duration: nullableString(valueAt(job, 'engagementDuration', 'label')),
      category: nullableString(valueAt(job, 'category', 'name')),
      skills: skillNames(valueAt(job, 'sandsData', 'ontologySkills')).concat(
        skillNames(valueAt(job, 'sandsData', 'additionalSkills')),
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
      totalHired: nullableNumber(activity?.totalHired),
      positionsToHire: nullableNumber(activity?.numberOfPositionsToHire),
      lastBuyerActivity: nullableString(activity?.lastBuyerActivity),
    },
    client: {
      topClient: nullableBoolean(details.topClient),
      paymentVerified: nullableBoolean(buyer?.isPaymentMethodVerified),
      country: nullableString(location?.country),
      city: nullableString(location?.city),
      totalAssignments: nullableNumber(buyerStats?.totalAssignments),
      activeAssignments: nullableNumber(buyerStats?.activeAssignmentsCount),
      hours: nullableNumber(buyerStats?.hoursCount),
      feedbackCount: nullableNumber(buyerStats?.feedbackCount),
      rating: nullableNumber(buyerStats?.score),
      totalJobsWithHires: nullableNumber(buyerStats?.totalJobsWithHires),
      jobsPosted: nullableNumber(buyerJobs?.postedCount),
      hireRate:
        nullableNumber(buyerStats?.totalJobsWithHires) !== null &&
        nullableNumber(buyerJobs?.postedCount) !== null &&
        (nullableNumber(buyerJobs?.postedCount) as number) > 0
          ? ((nullableNumber(buyerStats?.totalJobsWithHires) as number) /
              (nullableNumber(buyerJobs?.postedCount) as number)) *
            100
          : null,
      totalCharges: nullableNumber(valueAt(buyerStats, 'totalCharges', 'amount')),
      averageHourlyRate: clientAverageHourlyRate,
      memberSince: nullableString(valueAt(buyerCompany, 'contractDate')),
    },
    fit: {
      qualificationsMatched: hasQualificationMatches ? qualifiedMatches : null,
      qualificationsTotal: hasQualificationMatches ? matches.length : null,
      freelancerHourlyRate,
      rateContext:
        freelancerHourlyRate !== null &&
        clientAverageHourlyRate !== null &&
        clientAverageHourlyRate > 0
          ? freelancerHourlyRate / clientAverageHourlyRate
          : null,
      applicationState: currentApplicationState,
    },
    history,
    warnings: warningLabels(currentStatus, currentApplicationState),
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
    ) && ['amountPaid', 'feedbackScore'].every((key) => isNullableNumberValue(key, entry))
  );
}

export function isJobInsights(value: unknown): value is JobInsights {
  const object = record(value);
  const job = record(object?.job);
  const activity = record(object?.activity);
  const client = record(object?.client);
  const fit = record(object?.fit);
  const history = record(object?.history);
  const warnings = object?.warnings;
  if (
    !job ||
    !activity ||
    !client ||
    !fit ||
    !history ||
    !Array.isArray(job.skills) ||
    !Array.isArray(job.restrictions) ||
    !Array.isArray(history.recentJobs) ||
    !Array.isArray(history.relatedJobs) ||
    !Array.isArray(warnings)
  ) {
    return false;
  }

  return (
    job.skills.every((skill) => typeof skill === 'string') &&
    job.restrictions.every((restriction) => typeof restriction === 'string') &&
    history.recentJobs.every(isHistoryEntry) &&
    history.relatedJobs.every(isHistoryEntry) &&
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
    (fit.applicationState === null ||
      fit.applicationState === 'applied' ||
      fit.applicationState === 'invited' ||
      fit.applicationState === 'hired')
  );
}
