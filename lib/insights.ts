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
  };
  activity: {
    exactProposals: number | null;
    totalHired: number | null;
    invitedToInterview: number | null;
    unansweredInvites: number | null;
    invitationsSent: number | null;
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
  };
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

function skillNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((skill) => {
    const name = nullableString(valueAt(skill, 'prefLabel'));
    return name ? [name] : [];
  });
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
  const buyer = record(valueAt(details, 'buyer'));
  const buyerInfo = record(valueAt(buyer, 'info'));
  const buyerStats = record(valueAt(buyerInfo, 'stats'));
  const buyerJobs = record(valueAt(buyerInfo, 'jobs'));
  const location = record(valueAt(buyerInfo, 'location'));
  const hourlyRate = record(valueAt(buyerInfo, 'avgHourlyJobsRate'));
  const extendedBudget = record(valueAt(job, 'extendedBudgetInfo'));
  const postedCount = nullableNumber(buyerJobs?.postedCount);
  const hiredCount = nullableNumber(buyerStats?.totalJobsWithHires);

  return {
    job: {
      id: nullableString(info?.id),
      title: nullableString(info?.title),
      description: nullableString(job?.description),
      status: nullableString(job?.status),
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
    },
    activity: {
      exactProposals: nullableNumber(activity?.totalApplicants),
      totalHired: nullableNumber(activity?.totalHired),
      invitedToInterview: nullableNumber(activity?.totalInvitedToInterview),
      unansweredInvites: nullableNumber(activity?.unansweredInvites),
      invitationsSent: nullableNumber(activity?.invitationsSent),
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
      totalJobsWithHires: hiredCount,
      jobsPosted: postedCount,
      hireRate:
        hiredCount !== null && postedCount !== null && postedCount > 0
          ? (hiredCount / postedCount) * 100
          : null,
      totalCharges: nullableNumber(valueAt(buyerStats, 'totalCharges', 'amount')),
      averageHourlyRate: firstNumber(hourlyRate?.amount),
    },
  };
}

export function isJobInsights(value: unknown): value is JobInsights {
  const object = record(value);
  const job = record(object?.job);
  const activity = record(object?.activity);
  const client = record(object?.client);
  if (!job || !activity || !client || !Array.isArray(job.skills)) return false;

  const nullableStringValue = (key: string, source: RecordValue) =>
    source[key] === null || typeof source[key] === 'string';
  const nullableNumberValue = (key: string, source: RecordValue) =>
    source[key] === null || (typeof source[key] === 'number' && Number.isFinite(source[key]));
  const nullableBooleanValue = (key: string, source: RecordValue) =>
    source[key] === null || typeof source[key] === 'boolean';

  return (
    job.skills.every((skill) => typeof skill === 'string') &&
    ['id', 'title', 'description', 'status', 'type', 'postedOn', 'publishTime', 'workload',
      'contractorTier', 'budgetCurrency', 'duration', 'category'].every((key) =>
      nullableStringValue(key, job),
    ) &&
    ['budgetAmount', 'hourlyBudgetMin', 'hourlyBudgetMax'].every((key) =>
      nullableNumberValue(key, job),
    ) &&
    ['exactProposals', 'totalHired', 'invitedToInterview', 'unansweredInvites',
      'invitationsSent', 'positionsToHire'].every((key) => nullableNumberValue(key, activity)) &&
    nullableStringValue('lastBuyerActivity', activity) &&
    ['topClient', 'paymentVerified'].every((key) => nullableBooleanValue(key, client)) &&
    ['country', 'city'].every((key) => nullableStringValue(key, client)) &&
    ['totalAssignments', 'activeAssignments', 'hours', 'feedbackCount', 'rating',
      'totalJobsWithHires', 'jobsPosted', 'hireRate', 'totalCharges', 'averageHourlyRate'].every(
      (key) => nullableNumberValue(key, client),
    )
  );
}
