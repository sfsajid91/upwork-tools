import { describe, expect, test } from 'bun:test';
import { isJobInsights, normalizeJobInsights } from '../lib/insights';
import {
  createPageEvent,
  isPageEvent,
  isRuntimeMessage,
  STORE_JOB_INSIGHTS,
} from '../lib/protocol';

const rawResponse = {
  data: {
    jobAuthDetails: {
      topClient: false,
      opening: {
        job: {
          status: 'OPEN',
          postedOn: '2026-08-05T13:01:22.491Z',
          workload: 'Less than 30 hrs/week',
          contractorTier: 'INTERMEDIATE',
          description: 'Build the backend.',
          info: { id: 'job-1', type: 'HOURLY', title: 'Backend work' },
          budget: { amount: 0, currencyCode: 'USD' },
          sandsData: {
            ontologySkills: [{ prefLabel: 'TypeScript' }],
            additionalSkills: [{ prefLabel: 'Cloudflare' }],
          },
          clientActivity: {
            totalApplicants: 0,
            totalHired: 1,
            totalInvitedToInterview: 0,
            unansweredInvites: 0,
            invitationsSent: 0,
            numberOfPositionsToHire: 1,
            lastBuyerActivity: '2026-08-10T15:25:34.622Z',
          },
        },
      },
      buyer: {
        isPaymentMethodVerified: true,
        info: {
          location: { city: 'Oslo', country: 'Norway' },
          stats: {
            totalAssignments: 50,
            activeAssignmentsCount: 1,
            hoursCount: 7,
            feedbackCount: 40,
            score: 4.99,
            totalJobsWithHires: 49,
            totalCharges: { amount: 3393.46 },
          },
          jobs: { postedCount: 62 },
          avgHourlyJobsRate: { amount: 10.16 },
        },
        workHistory: [
          {
            status: 'CLOSED',
            startDate: '2026-07-21T00:34:12.125Z',
            totalCharge: 400,
            jobInfo: { id: 'history-1', title: 'Premium landing page design', type: 'FIXED' },
            feedback: { score: 5 },
          },
        ],
      },
    },
  },
};

describe('job insight normalization', () => {
  test('keeps valid zero values and calculates hire rate', () => {
    const insights = normalizeJobInsights(rawResponse);

    expect(insights).not.toBeNull();
    expect(insights?.activity.exactProposals).toBe(0);
    expect(insights?.job.budgetAmount).toBe(0);
    expect(insights?.history.recentJobs.length).toBe(1);
    expect(insights?.client.hireRate).toBeCloseTo((49 / 62) * 100);
    expect(insights?.job.skills).toEqual(['TypeScript', 'Cloudflare']);
    expect(isJobInsights(insights)).toBe(true);
  });

  test('uses the public ciphertext as the current job identity', () => {
    const response = structuredClone(rawResponse) as {
      data: { jobAuthDetails: { opening: { job: { info: Record<string, unknown> } } } };
    };
    response.data.jobAuthDetails.opening.job.info.ciphertext = '~public-job-id';
    expect(normalizeJobInsights(response)?.job.id).toBe('~public-job-id');
  });

  test('uses UID when the main job ID field is absent', () => {
    const response = structuredClone(rawResponse) as {
      data: { jobAuthDetails: { opening: { job: { info: Record<string, unknown> } } } };
    };
    delete response.data.jobAuthDetails.opening.job.info.id;
    response.data.jobAuthDetails.opening.job.info.uid = '~job-uid';
    expect(normalizeJobInsights(response)?.job.id).toBe('~job-uid');
  });

  test('returns null for an unrelated response', () => {
    expect(normalizeJobInsights({ data: { viewer: {} } })).toBeNull();
  });
});

describe('message validation', () => {
  test('accepts normalized page events and rejects malformed payloads', () => {
    const insights = normalizeJobInsights(rawResponse);
    if (!insights) throw new Error('fixture did not normalize');

    const event = createPageEvent(insights);
    expect(isPageEvent(event)).toBe(true);
    expect(isPageEvent({ ...event, source: 'other-extension' })).toBe(false);
    expect(isRuntimeMessage({ type: STORE_JOB_INSIGHTS, payload: insights })).toBe(true);
    expect(isRuntimeMessage({ type: STORE_JOB_INSIGHTS, payload: { nope: true } })).toBe(false);
  });
});
