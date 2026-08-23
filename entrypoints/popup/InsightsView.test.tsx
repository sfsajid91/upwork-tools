import { describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';
import { normalizeJobInsights } from '../../lib/insights';
import { AvailableState, EmptyState, LoadingState, ThemeToggle } from './InsightsView';

function samplePayload() {
  return {
    data: {
      jobAuthDetails: {
        topClient: true,
        opening: {
          job: {
            status: 'FILLED',
            postedOn: '2026-08-05T13:01:22.491Z',
            info: {
              id: 'job-1',
              title: 'Landing page backend with Cloudflare',
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
      },
    },
  };
}

describe('InsightsView components', () => {
  test('renders EmptyState in default and error tones', () => {
    const defaultHtml = renderToString(
      <EmptyState title="No job insight yet" copy="Open an Upwork job" />,
    );
    expect(defaultHtml.includes('No job insight yet')).toBe(true);
    expect(defaultHtml.includes('How it works')).toBe(true);

    const errorHtml = renderToString(
      <EmptyState title="Insights unavailable" copy="Failed to read tab" tone="error" />,
    );
    expect(errorHtml.includes('Insights unavailable')).toBe(true);
    expect(errorHtml.includes('Failed to read tab')).toBe(true);
  });

  test('renders LoadingState with skeleton markup', () => {
    const html = renderToString(<LoadingState />);
    expect(html.includes('aria-busy="true"')).toBe(true);
    expect(html.includes('Loading job insights')).toBe(true);
  });

  test('renders AvailableState with exact proposals, client quality, and fit', () => {
    const insights = normalizeJobInsights(samplePayload());
    expect(insights).not.toBeNull();
    if (!insights) throw new Error('insights should not be null');

    const html = renderToString(<AvailableState insights={insights} />);
    expect(html.includes('Exact Proposals')).toBe(true);
    expect(html.includes('38')).toBe(true);
    expect(html.includes('10.5%')).toBe(true);
    expect(html.includes('Client Track Record')).toBe(true);
    expect(html.includes('Verified')).toBe(true);
    expect(html.includes('4.99')).toBe(true);
    expect(html.includes('Your Fit &amp; Rates')).toBe(true);
    expect(html.includes('Related Previous Jobs')).toBe(true);
    expect(html.includes('Repeat Context')).toBe(true);
    expect(html.includes('Qualifications Matched')).toBe(true);
    expect(html.includes('1/2')).toBe(true);
    expect(html.includes('<details')).toBe(true);
    expect(html.includes('Qualification details')).toBe(true);
    expect(html.includes('EnglishLevel')).toBe(true);
    expect(html.includes('Client:')).toBe(true);
    expect(html.includes('Freelancer:')).toBe(true);
    expect(html.includes('Matched')).toBe(true);
    expect(html.includes('Not matched')).toBe(true);
  });

  test('renders unavailable qualification summary when matches are absent', () => {
    const payload = samplePayload();
    const insights = normalizeJobInsights({
      data: {
        jobAuthDetails: {
          ...payload.data.jobAuthDetails,
          currentUserInfo: {},
        },
      },
    });
    expect(insights).not.toBeNull();
    if (!insights) throw new Error('insights should not be null');

    const html = renderToString(<AvailableState insights={insights} />);
    expect(html.includes('Qualifications Matched')).toBe(true);
    expect(html.includes('Not available')).toBe(true);
    expect(html.includes('Qualification details')).toBe(false);
  });

  test('renders disabled watchlist control when the normalized job ID is missing', () => {
    const insights = normalizeJobInsights(samplePayload());
    expect(insights).not.toBeNull();
    if (!insights) throw new Error('insights should not be null');
    const html = renderToString(
      <AvailableState
        insights={{ ...insights, job: { ...insights.job, id: null } }}
        onToggleWatchlist={() => {}}
      />,
    );
    expect(html.includes('disabled=""')).toBe(true);
    expect(html.includes('Unavailable without a job ID')).toBe(true);
    expect(html.includes('Watchlist unavailable')).toBe(true);
  });

  test('renders saved and removable watchlist status with accessible labels', () => {
    const insights = normalizeJobInsights(samplePayload());
    expect(insights).not.toBeNull();
    if (!insights) throw new Error('insights should not be null');
    const savedHtml = renderToString(
      <AvailableState
        insights={insights}
        watchlistStatus={{ kind: 'saved' }}
        onToggleWatchlist={() => {}}
      />,
    );
    expect(savedHtml.includes('Saved locally')).toBe(true);
    expect(savedHtml.includes('Remove job from watchlist')).toBe(true);
    expect(savedHtml.includes('Observed application')).toBe(true);
    expect(savedHtml.includes('Already applied')).toBe(true);

    const removedHtml = renderToString(
      <AvailableState
        insights={insights}
        watchlistStatus={{ kind: 'not-saved' }}
        onToggleWatchlist={() => {}}
      />,
    );
    expect(removedHtml.includes('Not saved')).toBe(true);
    expect(removedHtml.includes('Save job to watchlist')).toBe(true);
  });

  test('renders storage failure fallback without recommendation language', () => {
    const insights = normalizeJobInsights(samplePayload());
    expect(insights).not.toBeNull();
    if (!insights) throw new Error('insights should not be null');
    const html = renderToString(
      <AvailableState
        insights={insights}
        watchlistStatus={{ kind: 'unavailable', reason: 'storage' }}
        onToggleWatchlist={() => {}}
      />,
    );
    expect(html.includes('Local storage unavailable')).toBe(true);
    expect(html.includes('Watchlist unavailable')).toBe(true);
    expect(html.toLowerCase().includes('recommend')).toBe(false);
  });

  test('renders ThemeToggle in system, light, and dark modes', () => {
    const systemHtml = renderToString(<ThemeToggle mode="system" onToggle={() => {}} />);
    expect(systemHtml.includes('System')).toBe(true);

    const lightHtml = renderToString(<ThemeToggle mode="light" onToggle={() => {}} />);
    expect(lightHtml.includes('Light')).toBe(true);

    const darkHtml = renderToString(<ThemeToggle mode="dark" onToggle={() => {}} />);
    expect(darkHtml.includes('Dark')).toBe(true);
  });
});
