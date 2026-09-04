import { describe, expect, test } from 'bun:test';
import type { JobInsights } from '../../src/lib/insights';
import {
  createPageEvent,
  isJobHistoryResponse,
  isPageEvent,
  isPageReplayRequest,
  isRuntimeMessage,
  isRuntimeReplayRequest,
  PAGE_EVENT_SOURCE,
  PAGE_EVENT_VERSION,
  REQUEST_CURRENT_JOB_INSIGHTS,
  REQUEST_JOB_INSIGHTS_REPLAY,
  STORE_JOB_INSIGHTS,
} from '../../src/lib/protocol';

const insights: JobInsights = {
  viewerMode: 'authenticated',
  job: {
    id: 'job-1',
    title: null,
    description: null,
    status: null,
    type: null,
    postedOn: null,
    publishTime: null,
    workload: null,
    contractorTier: null,
    budgetAmount: null,
    budgetCurrency: null,
    hourlyBudgetMin: null,
    hourlyBudgetMax: null,
    duration: null,
    category: null,
    skills: [],
    restrictions: [],
  },
  activity: {
    exactProposals: null,
    interviewed: null,
    interviewRate: null,
    totalHired: null,
    positionsToHire: null,
    lastBuyerActivity: null,
  },
  client: {
    topClient: null,
    paymentVerified: null,
    country: null,
    city: null,
    totalAssignments: null,
    activeAssignments: null,
    hours: null,
    feedbackCount: null,
    rating: null,
    totalJobsWithHires: null,
    jobsPosted: null,
    hireRate: null,
    totalCharges: null,
    averageHourlyRate: null,
    memberSince: null,
  },
  fit: {
    qualificationsMatched: null,
    qualificationsTotal: null,
    qualificationDetails: null,
    freelancerHourlyRate: null,
    rateContext: null,
    applicationState: null,
  },
  history: { recentJobs: [], relatedJobs: [] },
  similarJobs: [],
  warnings: [],
};
test('requires valid conversion stats in job history responses', () => {
  const response = {
    jobId: 'job-1',
    captures: [],
    summary: null,
    velocity: null,
    payProfile: {
      totalCharges: null,
      averageHourlyRate: null,
      medianRecentFixedPayment: null,
      averageRecentFixedPayment: null,
      historicalHourlyRates: null,
    },
    conversion: {
      applications: 2,
      interviews: 1,
      hires: 1,
      applyToInterviewRate: 50,
      applyToInterviewDenominator: 2,
      interviewToHireRate: 100,
      interviewToHireDenominator: 1,
    },
  };

  expect(isJobHistoryResponse(response)).toBe(true);
  const withCaptures = {
    ...response,
    captures: [
      { capturedAt: 100, applicants: 2 },
      { capturedAt: 200, applicants: 3 },
    ],
    summary: {
      snapshotCount: 2,
      latestApplicants: 3,
      firstSeenApplicants: 2,
      firstSeenDelta: 1,
      recentDelta: 1,
    },
  };
  expect(isJobHistoryResponse(withCaptures)).toBe(true);
  expect(
    isJobHistoryResponse({
      ...withCaptures,
      captures: [{ capturedAt: 100, applicants: -1 }],
      summary: { ...withCaptures.summary, snapshotCount: 1 },
    }),
  ).toBe(false);
  for (const capturedAt of [0, -1, 1.5, Number.NaN]) {
    expect(
      isJobHistoryResponse({
        ...withCaptures,
        captures: [{ capturedAt, applicants: 2 }],
        summary: { ...withCaptures.summary, snapshotCount: 1 },
      }),
    ).toBe(false);
  }
  expect(
    isJobHistoryResponse({
      ...withCaptures,
      summary: { ...withCaptures.summary, snapshotCount: 1 },
    }),
  ).toBe(false);
  expect(
    isJobHistoryResponse({
      ...response,
      conversion: { ...response.conversion, applications: -1 },
    }),
  ).toBe(false);
});

describe('replay protocol', () => {
  test('accepts normal and replay page events', () => {
    expect(isPageEvent(createPageEvent(insights))).toBe(true);
    expect(isPageEvent(createPageEvent(insights, { requestId: 'request-1', capturedAt: 10 }))).toBe(
      true,
    );
    expect(isPageEvent(createPageEvent(insights, { requestId: '', capturedAt: Number.NaN }))).toBe(
      false,
    );
    for (const capturedAt of [0, -1, 1.5, Number.NaN]) {
      expect(isPageEvent(createPageEvent(insights, { requestId: 'request-1', capturedAt }))).toBe(
        false,
      );
    }
  });

  test('validates page and runtime replay requests', () => {
    const pageRequest = {
      source: PAGE_EVENT_SOURCE,
      version: PAGE_EVENT_VERSION,
      type: REQUEST_CURRENT_JOB_INSIGHTS,
      requestId: 'request-1',
    };
    expect(isPageReplayRequest(pageRequest)).toBe(true);
    expect(isPageReplayRequest({ ...pageRequest, requestId: '' })).toBe(false);
    expect(
      isRuntimeReplayRequest({
        type: REQUEST_JOB_INSIGHTS_REPLAY,
        tabId: 4,
        requestId: 'request-1',
      }),
    ).toBe(true);
    expect(
      isRuntimeReplayRequest({ type: REQUEST_JOB_INSIGHTS_REPLAY, tabId: 4, requestId: '' }),
    ).toBe(false);
  });

  test('accepts replay STORE metadata and rejects invalid timestamps', () => {
    expect(
      isRuntimeMessage({
        type: STORE_JOB_INSIGHTS,
        payload: insights,
        replay: { capturedAt: 100 },
      }),
    ).toBe(true);
    expect(
      isRuntimeMessage({
        type: STORE_JOB_INSIGHTS,
        payload: insights,
        replay: { capturedAt: Number.POSITIVE_INFINITY },
      }),
    ).toBe(false);
    for (const capturedAt of [0, -1, 1.5, Number.NaN]) {
      expect(
        isRuntimeMessage({
          type: STORE_JOB_INSIGHTS,
          payload: insights,
          replay: { capturedAt },
        }),
      ).toBe(false);
    }
    expect(isRuntimeMessage({ type: STORE_JOB_INSIGHTS, payload: insights })).toBe(true);
  });
});
