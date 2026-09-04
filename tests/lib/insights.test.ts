import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { normalizeJobInsights } from '../../src/lib/insights';

const visitorFixture = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('../fixtures/sample-visitor-job-details.json', import.meta.url)),
    'utf8',
  ),
);

function payload(overrides: Record<string, unknown> = {}) {
  return {
    data: {
      jobAuthDetails: {
        topClient: false,
        opening: {
          job: {
            status: 'FILLED',
            postedOn: '2026-08-05T13:01:22.491Z',
            info: {
              id: 'job-1',
              title: 'Landing page backend',
              type: 'FIXED',
              createdOn: '2026-08-05T13:01:22.491Z',
            },
            clientActivity: {
              totalApplicants: 38,
              totalInvitedToInterview: 4,
              totalHired: 1,
              numberOfPositionsToHire: 1,
              lastBuyerActivity: '2026-08-10T15:25:34.622Z',
            },
            budget: { amount: 400, currencyCode: 'USD' },
          },
          qualifications: {
            minJobSuccessScore: 90,
            prefEnglishSkill: 'FLUENT',
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
            company: { contractDate: '2009-10-04T00:00:00.000Z' },
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
        currentUserInfo: {
          freelancerInfo: {
            applied: true,
            hourlyRate: { amount: 25 },
            qualificationsMatches: {
              matches: [
                {
                  qualification: 'EnglishLevel',
                  clientPreferred: '3',
                  clientPreferredLabel: 'Fluent',
                  freelancerValue: '3',
                  freelancerValueLabel: 'Fluent',
                  qualified: true,
                },
                {
                  qualification: 'MinimumJobSuccessScore',
                  clientPreferred: '90',
                  clientPreferredLabel: 'At least 90%',
                  freelancerValue: '70',
                  freelancerValueLabel: '70%',
                  qualified: false,
                },
              ],
            },
          },
        },
        ...overrides,
      },
    },
  };
}

describe('normalizeJobInsights', () => {
  test('normalizes scope metrics, fit, warnings, and related history', () => {
    const insights = normalizeJobInsights(payload());

    expect(insights).not.toBeNull();
    expect(Math.abs((insights?.activity.interviewRate ?? 0) - 10.526) < 0.001).toBe(true);
    expect(Math.abs((insights?.client.hireRate ?? 0) - 79.032) < 0.001).toBe(true);
    expect(insights?.fit.qualificationsMatched).toBe(1);
    expect(insights?.fit.qualificationsTotal).toBe(2);
    expect(insights?.fit.qualificationDetails).toEqual([
      {
        requirementName: 'EnglishLevel',
        clientLabel: 'Fluent',
        freelancerValue: '3',
        freelancerLabel: 'Fluent',
        matched: true,
      },
      {
        requirementName: 'MinimumJobSuccessScore',
        clientLabel: 'At least 90%',
        freelancerValue: '70',
        freelancerLabel: '70%',
        matched: false,
      },
    ]);
    expect(Math.abs((insights?.fit.rateContext ?? 0) - 2.46) < 0.01).toBe(true);
    expect(insights?.warnings).toEqual(['position-filled', 'already-applied']);
    expect(insights?.history.recentJobs.length).toBe(1);
    expect(insights?.history.relatedJobs.length).toBe(1);
    expect(insights?.job.restrictions).toEqual(['90%+ JSS', 'English: FLUENT']);
  });
  test('normalizes missing payment verification as null', () => {
    const insights = normalizeJobInsights(payload({ buyer: { info: {} } }));

    expect(insights?.client.paymentVerified).toBeNull();
  });
  test('normalizes the public visitor fixture without personal fields', () => {
    const insights = normalizeJobInsights(visitorFixture);

    expect(insights).not.toBeNull();
    expect(insights?.viewerMode).toBe('visitor');
    expect(insights?.job.id).toBe('~022090578797924892358');
    expect(insights?.job.title).toBe('Website Developer');
    expect(insights?.activity.exactProposals).toBe(10);
    expect(insights?.activity.interviewed).toBe(10);
    expect(insights?.client.paymentVerified).toBe(true);
    expect(insights?.client.jobsPosted).toBeNull();
    expect(insights?.client.hireRate).toBeNull();
    expect(insights?.fit).toEqual({
      qualificationsMatched: null,
      qualificationsTotal: null,
      qualificationDetails: null,
      freelancerHourlyRate: null,
      rateContext: null,
      applicationState: null,
    });
    expect(insights?.job.restrictions).toEqual(['India', 'Philippines']);
    expect(insights?.similarJobs).toEqual([
      {
        id: null,
        ciphertext: '~022064143618482144543',
        title: 'Interior Design Website - Experienced Wordpress Developer Needed',
        description: "We're looking for an experienced and creative developer...",
        amount: 25,
        currency: null,
        contractorTier: 'EXPERT',
        type: 'FIXED',
        durationLabel: '1 to 3 months',
        skills: ['WordPress'],
      },
    ]);
  });
  test('normalizes expanded restrictions and count-based hiring warnings', () => {
    const insights = normalizeJobInsights(
      payload({
        opening: {
          job: {
            status: 'OPEN',
            info: { id: 'job-open', title: 'Restricted open job' },
            clientActivity: {
              totalHired: 2,
              numberOfPositionsToHire: 2,
            },
          },
          qualifications: {
            locations: [{ label: 'New York' }],
            minOdeskHours: 100,
            earnings: { amount: 1_000, currencyCode: 'USD' },
            onSiteType: 'REQUIRED',
          },
        },
      }),
    );

    expect(insights?.job.restrictions).toEqual([
      'New York',
      '100+ hours',
      'USD 1000+ earnings',
      'On-site: REQUIRED',
    ]);
    expect(insights?.warnings).toEqual(['position-filled', 'already-applied']);
  });

  test('excludes the current job and weak title matches from related history', () => {
    const insights = normalizeJobInsights(
      payload({
        buyer: {
          workHistory: [
            {
              startDate: '2026-08-20T00:00:00.000Z',
              jobInfo: { id: 'job-1', title: 'Landing page backend' },
            },
            {
              startDate: '2026-08-19T00:00:00.000Z',
              jobInfo: { id: 'weak-1', title: 'Backend tooling' },
            },
            {
              startDate: '2026-08-18T00:00:00.000Z',
              jobInfo: { id: 'strong-1', title: 'Landing page design' },
            },
          ],
        },
      }),
    );

    expect(insights?.history.relatedJobs.map((job) => job.id)).toEqual(['strong-1']);
  });
  test('matches three-character technical tokens but filters generic roles', () => {
    for (const token of ['AWS', 'GCP', 'PHP', 'SQL', 'Vue', 'iOS']) {
      const result = normalizeJobInsights(
        payload({
          opening: {
            job: {
              status: 'OPEN',
              info: { id: 'current', title: `${token} developer` },
            },
            qualifications: {},
          },
          buyer: {
            workHistory: [
              {
                startDate: '2026-08-20T00:00:00.000Z',
                jobInfo: { id: `related-${token}`, title: `${token.toLowerCase()} specialist` },
              },
            ],
          },
        }),
      );
      expect(result?.history.relatedJobs.map((job) => job.id)).toEqual([`related-${token}`]);
    }

    const genericOnly = normalizeJobInsights(
      payload({
        opening: {
          job: {
            status: 'OPEN',
            info: { id: 'current', title: 'Senior Lead Developer Engineer' },
          },
          qualifications: {},
        },
      }),
    );
    expect(genericOnly?.history.relatedJobs).toEqual([]);

    const roleOnlyOverlap = normalizeJobInsights(
      payload({
        opening: {
          job: {
            status: 'OPEN',
            info: { id: 'current', title: 'Backend developer' },
          },
          qualifications: {},
        },
        buyer: {
          workHistory: [
            {
              startDate: '2026-08-20T00:00:00.000Z',
              jobInfo: { id: 'frontend', title: 'Frontend developer' },
            },
          ],
        },
      }),
    );
    expect(roleOnlyOverlap?.history.relatedJobs).toEqual([]);
  });
  test('filters expanded generic role terms from related history', () => {
    for (const role of ['manager', 'consultant', 'specialist', 'designer']) {
      const result = normalizeJobInsights(
        payload({
          opening: {
            job: {
              status: 'OPEN',
              info: { id: 'current', title: `${role} ${role}` },
            },
            qualifications: {},
          },
          buyer: {
            workHistory: [
              {
                startDate: '2026-08-20T00:00:00.000Z',
                jobInfo: { id: `related-${role}`, title: `${role} ${role}` },
              },
            ],
          },
        }),
      );
      expect(result?.history.relatedJobs).toEqual([]);
    }
  });
  test('excludes current history when public and internal IDs differ', () => {
    const insights = normalizeJobInsights(
      payload({
        opening: {
          job: {
            status: 'OPEN',
            info: {
              ciphertext: '~current-public',
              id: 'current-internal',
              title: 'Landing page backend',
            },
          },
          qualifications: {},
        },
        buyer: {
          workHistory: [
            {
              startDate: '2026-08-20T00:00:00.000Z',
              jobInfo: {
                ciphertext: '~current-public',
                id: 'current-internal',
                title: 'Landing page backend',
              },
            },
            {
              startDate: '2026-08-19T00:00:00.000Z',
              jobInfo: {
                ciphertext: '~other-public',
                id: 'other-internal',
                title: 'Landing page backend API',
              },
            },
          ],
        },
      }),
    );

    expect(insights?.history.relatedJobs.map((job) => job.id)).toEqual(['~other-public']);
  });

  test('normalizes ID variants when excluding the current history entry', () => {
    const insights = normalizeJobInsights(
      payload({
        opening: {
          job: {
            info: { id: 'current-job', title: 'Landing page backend' },
            qualifications: {},
          },
        },
        buyer: {
          workHistory: [
            {
              startDate: '2026-08-20T00:00:00.000Z',
              jobInfo: { id: '~current-job', title: 'Landing page backend' },
            },
            {
              startDate: '2026-08-19T00:00:00.000Z',
              jobInfo: { id: '~other-job', title: 'Landing page backend API' },
            },
          ],
        },
      }),
    );

    expect(insights?.history.relatedJobs.map((job) => job.id)).toEqual(['~other-job']);
  });

  test('normalizes negative and fractional activity counts to null', () => {
    const insights = normalizeJobInsights(
      payload({
        opening: {
          job: {
            info: { id: 'count-job', title: 'Count test' },
            clientActivity: {
              totalApplicants: -1,
              totalInvitedToInterview: 1.5,
              totalHired: Number.NaN,
              numberOfPositionsToHire: 2.5,
            },
            qualifications: {},
          },
        },
      }),
    );

    expect(insights?.activity).toMatchObject({
      exactProposals: null,
      interviewed: null,
      totalHired: null,
      positionsToHire: null,
    });
  });

  test('preserves explicit hourly history fields for pay metrics', () => {
    const insights = normalizeJobInsights(
      payload({
        buyer: {
          workHistory: [
            {
              status: 'CLOSED',
              startDate: '2026-08-20T00:00:00.000Z',
              totalHours: 5,
              rate: { amount: 12 },
              jobInfo: { id: 'hourly-1', title: 'Hourly API work', type: 'HOURLY' },
            },
          ],
        },
      }),
    );

    expect(insights?.history.recentJobs[0]).toMatchObject({
      id: 'hourly-1',
      hours: 5,
      hourlyRate: 12,
    });
  });

  test('orders history deterministically when start dates are invalid', () => {
    const insights = normalizeJobInsights(
      payload({
        buyer: {
          workHistory: [
            {
              status: 'CLOSED',
              startDate: 'not-a-date',
              jobInfo: { id: 'invalid-1', title: 'Broken date gig', type: 'FIXED' },
            },
            {
              status: 'CLOSED',
              startDate: '2026-01-10T00:00:00.000Z',
              jobInfo: { id: 'old-1', title: 'Older landing page', type: 'FIXED' },
            },
            {
              status: 'CLOSED',
              startDate: '2026-08-01T00:00:00.000Z',
              jobInfo: { id: 'new-1', title: 'Newer landing page', type: 'FIXED' },
            },
          ],
        },
      }),
    );

    expect(insights?.history.recentJobs.map((job) => job.id)).toEqual([
      'new-1',
      'old-1',
      'invalid-1',
    ]);
  });

  test('keeps history empty when buyer workHistory is absent', () => {
    const insights = normalizeJobInsights(payload({ buyer: {} }));

    expect(insights?.history.recentJobs).toEqual([]);
    expect(insights?.history.relatedJobs).toEqual([]);
  });

  test('preserves zero applicants and does not invent an interview rate', () => {
    const insights = normalizeJobInsights(
      payload({
        opening: {
          job: {
            status: 'OPEN',
            clientActivity: {
              totalApplicants: 0,
              totalInvitedToInterview: 0,
              totalHired: 0,
              numberOfPositionsToHire: 0,
            },
            info: { title: 'Zero applicant job' },
          },
          qualifications: {},
        },
        currentUserInfo: {
          freelancerInfo: {
            applied: null,
            hired: null,
            pendingInvite: null,
          },
        },
      }),
    );

    expect(insights?.activity.exactProposals).toBe(0);
    expect(insights?.activity.interviewRate).toBeNull();
    expect(Math.abs((insights?.client.hireRate ?? 0) - 79.032) < 0.001).toBe(true);
    expect(insights?.warnings).toEqual([]);
  });
});
