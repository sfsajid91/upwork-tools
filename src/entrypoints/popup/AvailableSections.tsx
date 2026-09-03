import {
  HistoryDetails,
  MetricCell,
  PortfolioMatches,
  QualificationDetails,
  SimilarOpportunities,
  type PopupPersonalization,
} from './PopupComponents';
import { TargetIcon } from './PopupIcons';
import {
  formatApplicationState,
  formatDate,
  formatMoney,
  formatRateContext,
} from '../../lib/format';
import type { ClientHistoryEntry, JobInsights } from '../../lib/insights';

export function FitSection({
  insights,
  personalization,
}: {
  insights: JobInsights;
  personalization: PopupPersonalization;
}) {
  const { client, fit } = insights;
  const effectiveFreelancerHourlyRate =
    fit.freelancerHourlyRate ?? personalization.fallbackHourlyRate;
  const effectiveRateContext =
    fit.rateContext ??
    (effectiveFreelancerHourlyRate !== null &&
    client.averageHourlyRate !== null &&
    client.averageHourlyRate > 0
      ? effectiveFreelancerHourlyRate / client.averageHourlyRate
      : null);
  const usesFallbackHourlyRate =
    fit.freelancerHourlyRate === null && personalization.fallbackHourlyRate !== null;
  const qualificationSummary =
    fit.qualificationsMatched !== null && fit.qualificationsTotal !== null
      ? `${fit.qualificationsMatched}/${fit.qualificationsTotal}`
      : null;

  return insights.viewerMode === 'visitor' ? (
    <section
      className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 shadow-xs dark:border-amber-900/70 dark:bg-amber-950/30"
      aria-labelledby="fit-heading"
    >
      <h2 id="fit-heading" className="text-xs font-bold text-amber-950 dark:text-amber-200">
        Personal Fit
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-amber-900 dark:text-amber-300">
        Log in to Upwork to view personal skill match %, portfolio ranking, and rate comparison.
      </p>
    </section>
  ) : (
    <section
      className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
      aria-labelledby="fit-heading"
    >
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <TargetIcon className="size-3.5 text-slate-500 dark:text-slate-400" />
          <h2 id="fit-heading" className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Your Fit & Rates
          </h2>
        </div>
        {fit.applicationState && (
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {formatApplicationState(fit.applicationState)}
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Qualifications Matched
          </span>
          <span className="rounded-md border border-slate-200/90 bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            {qualificationSummary ?? 'Not available'}
          </span>
        </div>
        <QualificationDetails details={fit.qualificationDetails ?? []} />
        {personalization.skillMatch && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
            <MetricCell
              label="Profile skill match"
              value={`${personalization.skillMatch.matched}/${personalization.skillMatch.total}`}
            />
            {personalization.skillMatch.matchedSkills.length > 0 && (
              <p className="mt-1 text-[10.5px] text-slate-500 dark:text-slate-400">
                Matched: {personalization.skillMatch.matchedSkills.join(' · ')}
              </p>
            )}
          </div>
        )}

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <div>
              <span className="block text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
                Your Hourly Rate
              </span>
              <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatMoney(effectiveFreelancerHourlyRate, 'USD')}
              </span>
              {usesFallbackHourlyRate && (
                <span className="mt-0.5 block text-[10px] text-slate-500 dark:text-slate-400">
                  Local fallback
                </span>
              )}
            </div>
            <div>
              <span className="block text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
                Client Avg Rate
              </span>
              <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                {formatMoney(client.averageHourlyRate, 'USD')}
              </span>
            </div>
          </div>

          {effectiveRateContext !== null && (
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Rate Comparison
              </span>
              <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                {formatRateContext(effectiveRateContext)}
              </span>
            </div>
          )}
        </div>
        <PortfolioMatches matches={personalization.portfolioMatches} />
      </div>
    </section>
  );
}

export function AvailableTail({
  insights,
  clientHistory,
}: {
  insights: JobInsights;
  clientHistory: { recentJobs: ClientHistoryEntry[]; relatedJobs: ClientHistoryEntry[] };
}) {
  return (
    <>
      {insights.similarJobs.length > 0 && <SimilarOpportunities jobs={insights.similarJobs} />}
      {insights.viewerMode === 'authenticated' && (
        <>
          <HistoryDetails
            title="Related Previous Jobs"
            jobs={clientHistory.relatedJobs}
            badgeText="Repeat Context"
            defaultOpen={true}
          />
          <HistoryDetails title="Client Hiring History" jobs={clientHistory.recentJobs} />
        </>
      )}
      <footer className="mt-1 flex flex-col gap-1 rounded-xl bg-slate-200/50 p-2.5 text-[10.5px] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span>Posted: {formatDate(insights.job.postedOn)}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {insights.job.budgetAmount === null
              ? 'Budget: Not provided'
              : `Budget: ${formatMoney(insights.job.budgetAmount, insights.job.budgetCurrency)}`}
          </span>
        </div>
        <div className="text-center text-[10px] text-slate-400 dark:text-slate-500">
          {insights.viewerMode === 'visitor'
            ? 'Local session insights · Public GraphQL snapshot'
            : 'Local session insights · Authenticated GraphQL snapshot'}
        </div>
      </footer>
    </>
  );
}
