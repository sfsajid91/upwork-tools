import { Badge } from '@/components/ui/badge';
import {
  formatApplicationState,
  formatDate,
  formatMoney,
  formatRateContext,
} from '../../lib/format';
import type { ClientHistoryEntry, JobInsights } from '../../lib/insights';
import {
  HistoryDetails,
  MetricCell,
  type PopupPersonalization,
  PortfolioMatches,
  QualificationDetails,
  SimilarOpportunities,
} from './PopupComponents';
import { TargetIcon } from './PopupIcons';

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
      className="rounded-xl border border-amber-300/80 bg-amber-50/80 p-3.5 shadow-xs text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200"
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
      className="rounded-xl border border-border bg-card p-3.5 shadow-xs text-card-foreground"
      aria-labelledby="fit-heading"
    >
      <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2">
        <div className="flex items-center gap-1.5">
          <TargetIcon className="size-3.5 text-muted-foreground" />
          <h2 id="fit-heading" className="text-xs font-bold text-foreground">
            Your Fit & Rates
          </h2>
        </div>
        {fit.applicationState && (
          <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
            {formatApplicationState(fit.applicationState)}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Qualifications Matched</span>
          <Badge variant="secondary" className="font-bold tabular-nums text-xs">
            {qualificationSummary ?? 'Not available'}
          </Badge>
        </div>

        <QualificationDetails details={fit.qualificationDetails ?? []} />

        {personalization.skillMatch && (
          <div className="rounded-lg bg-muted/40 p-2.5">
            <MetricCell
              label="Profile skill match"
              value={`${personalization.skillMatch.matched}/${personalization.skillMatch.total}`}
            />
            {personalization.skillMatch.matchedSkills.length > 0 && (
              <p className="mt-1 text-[10.5px] text-muted-foreground">
                Matched: {personalization.skillMatch.matchedSkills.join(' · ')}
              </p>
            )}
          </div>
        )}

        <div className="rounded-lg bg-muted/40 p-2.5">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <div>
              <span className="block text-[10.5px] font-medium text-muted-foreground">
                Your Hourly Rate
              </span>
              <span className="text-xs font-bold tabular-nums text-foreground">
                {formatMoney(effectiveFreelancerHourlyRate, 'USD')}
              </span>
              {usesFallbackHourlyRate && (
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  Local fallback
                </span>
              )}
            </div>
            <div>
              <span className="block text-[10.5px] font-medium text-muted-foreground">
                Client Avg Rate
              </span>
              <span className="text-xs font-bold tabular-nums text-foreground">
                {formatMoney(client.averageHourlyRate, 'USD')}
              </span>
            </div>
          </div>

          {effectiveRateContext !== null && (
            <div className="flex items-center justify-between border-t border-border/60 pt-2">
              <span className="text-[11px] font-medium text-muted-foreground">Rate Comparison</span>
              <Badge
                variant="outline"
                className="font-semibold tabular-nums text-[11px] bg-background text-foreground"
              >
                {formatRateContext(effectiveRateContext)}
              </Badge>
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
      <footer className="mt-1 flex flex-col gap-1 rounded-xl border border-border/40 bg-muted/30 p-2.5 text-[10.5px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Posted: {formatDate(insights.job.postedOn)}</span>
          <span className="font-medium text-foreground">
            {insights.job.budgetAmount === null
              ? 'Budget: Not provided'
              : `Budget: ${formatMoney(insights.job.budgetAmount, insights.job.budgetCurrency)}`}
          </span>
        </div>
        <div className="text-center text-[10px] text-muted-foreground/80">
          {insights.viewerMode === 'visitor'
            ? 'Local session insights · Public GraphQL snapshot'
            : 'Local session insights · Authenticated GraphQL snapshot'}
        </div>
      </footer>
    </>
  );
}
