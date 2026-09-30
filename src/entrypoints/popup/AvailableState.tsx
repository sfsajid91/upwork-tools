import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatApplicationState,
  formatJobStatus,
  formatMoney,
  formatNumber,
  formatRelativeCaptureTime,
  formatTrackingSpan,
} from '../../lib/format';
import type { JobInsights } from '../../lib/insights';
import type { JobHistoryResponse } from '../../lib/protocol';
import type { ThemeMode } from '../../lib/theme';
import { ApplicantHistoryChart } from './ApplicantHistoryChart';
import { AvailableTail, FitSection } from './AvailableSections';
import { ClientTrackRecordCard } from './ClientTrackRecordCard';
import { ExactProposalsCard } from './ExactProposalsCard';
import {
  ConversionSummary,
  MetricCell,
  type PopupPersonalization,
  ThemeToggle,
  VisitorQualifications,
  WarningStrip,
  type WatchlistStatus,
} from './PopupComponents';
import { BuildingIcon, StarIcon } from './PopupIcons';

const EMPTY_POPUP_PERSONALIZATION: PopupPersonalization = {
  fallbackHourlyRate: null,
  skillMatch: null,
  portfolioMatches: [],
};

export function AvailableState({
  insights,
  history,
  personalization = EMPTY_POPUP_PERSONALIZATION,
  historyFallback = false,
  watchlistStatus = { kind: 'not-saved' },
  watchlistBusy = false,
  onToggleWatchlist,
  themeMode,
  onToggleTheme,
}: {
  insights: JobInsights;
  history?: JobHistoryResponse | null;
  personalization?: PopupPersonalization;
  historyFallback?: boolean;
  watchlistStatus?: WatchlistStatus;
  watchlistBusy?: boolean;
  onToggleWatchlist?: () => void | Promise<void>;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  const { job, activity, client, fit, history: clientHistory } = insights;
  const jobId = typeof job.id === 'string' && job.id.trim().length > 0 ? job.id.trim() : null;
  const effectiveWatchlistStatus =
    jobId === null && watchlistStatus.kind === 'not-saved'
      ? { kind: 'unavailable' as const, reason: 'missing-id' as const }
      : watchlistStatus;
  const canToggleWatchlist =
    jobId !== null &&
    effectiveWatchlistStatus.kind !== 'unavailable' &&
    onToggleWatchlist !== undefined;
  const watchlistLabel =
    effectiveWatchlistStatus.kind === 'saved'
      ? 'Remove job from watchlist'
      : effectiveWatchlistStatus.kind === 'unavailable'
        ? 'Watchlist unavailable'
        : 'Save job to watchlist';
  const observedApplicationLabel =
    fit.applicationState === null
      ? 'Observed application state: Not observed'
      : `Observed application state: ${formatApplicationState(fit.applicationState)}`;

  const isStatusFilled = job.status?.toUpperCase() === 'FILLED';
  const isStatusOpen = job.status?.toUpperCase() === 'OPEN';

  const statusBadge = (
    <Badge
      variant="outline"
      className={`gap-1 font-semibold text-[10px] ${
        isStatusFilled
          ? 'border-amber-500/30 bg-amber-50/80 text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/60 dark:text-amber-300'
          : isStatusOpen
            ? 'border-emerald-500/30 bg-emerald-50/80 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'border-border bg-muted/60 text-muted-foreground'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isStatusFilled
            ? 'bg-amber-500 dark:bg-amber-400'
            : isStatusOpen
              ? 'bg-emerald-500 dark:bg-emerald-400'
              : 'bg-muted-foreground'
        }`}
      />
      {formatJobStatus(job.status)}
    </Badge>
  );

  const subTitleParts = [job.type, job.contractorTier, job.category].filter(Boolean);
  const historyCaptures = history?.captures ?? [];
  const firstHistoryCapture = historyCaptures[0];
  const latestHistoryCapture = historyCaptures.at(-1);
  const historyTrackingLabel =
    history?.summary && historyCaptures.length === 1 && firstHistoryCapture
      ? `1 capture · First tracked ${formatRelativeCaptureTime(firstHistoryCapture.capturedAt)}`
      : history?.summary && firstHistoryCapture && latestHistoryCapture
        ? `${historyCaptures.length} captures · ${formatTrackingSpan(firstHistoryCapture.capturedAt, latestHistoryCapture.capturedAt)}`
        : `${history?.summary?.snapshotCount ?? 0} captures`;
  const historyMetricCount = [
    history?.summary?.firstSeenDelta,
    history?.summary?.recentDelta,
    history?.velocity,
  ].filter((value) => value !== null && value !== undefined).length;
  const historyMetricGridClass =
    historyMetricCount === 1
      ? 'grid-cols-1'
      : historyMetricCount === 2
        ? 'grid-cols-2'
        : 'grid-cols-3';

  return (
    <div className="flex flex-col gap-2.5">
      {/* Job Header Card */}
      <header className="rounded-xl border border-border bg-card p-3.5 shadow-xs text-card-foreground">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {statusBadge}
            {insights.viewerMode === 'visitor' && (
              <Badge
                variant="secondary"
                className="font-medium text-[10px] text-amber-700 dark:text-amber-400 bg-amber-500/10"
                role="status"
              >
                Public Job View
              </Badge>
            )}
          </div>
          {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
        </div>

        <h1 className="text-[14px] font-bold leading-snug tracking-tight text-foreground line-clamp-2">
          {job.title ?? 'Untitled Job'}
        </h1>

        {subTitleParts.length > 0 && (
          <p className="mt-1 text-[11px] font-medium text-muted-foreground">
            {subTitleParts.join(' · ')}
          </p>
        )}

        {historyFallback && (
          <p
            className="mt-2 rounded-lg border border-amber-300/80 bg-amber-50/80 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-900 dark:border-amber-900/80 dark:bg-amber-950/40 dark:text-amber-200"
            role="status"
            aria-live="polite"
          >
            Showing session-only insights. Optional history storage was unavailable.
          </p>
        )}

        <section
          className="mt-2.5 rounded-lg border border-border/50 bg-muted/40 p-2.5"
          aria-label="Local job controls"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="block text-[10.5px] font-semibold text-foreground">Watchlist</span>
              <span
                className="block text-[10px] text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                {effectiveWatchlistStatus.kind === 'saved'
                  ? 'Saved locally'
                  : effectiveWatchlistStatus.kind === 'unavailable'
                    ? effectiveWatchlistStatus.reason === 'missing-id'
                      ? 'Unavailable without a job ID'
                      : 'Local storage unavailable'
                    : 'Not saved'}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="rounded-full gap-1"
              aria-label={watchlistLabel}
              title={watchlistLabel}
              disabled={!canToggleWatchlist || watchlistBusy}
              onClick={() => void onToggleWatchlist?.()}
            >
              <StarIcon
                className={`size-3 ${
                  effectiveWatchlistStatus.kind === 'saved'
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-muted-foreground'
                }`}
              />
              <span>
                {watchlistBusy
                  ? 'Saving…'
                  : effectiveWatchlistStatus.kind === 'saved'
                    ? 'Saved'
                    : 'Save'}
              </span>
            </Button>
          </div>
          {insights.viewerMode === 'authenticated' && (
            <div
              className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-[10.5px]"
              role="status"
              aria-label={observedApplicationLabel}
            >
              <span className="font-medium text-muted-foreground">Observed application</span>
              <span className="font-semibold text-foreground">
                {formatApplicationState(fit.applicationState)}
              </span>
            </div>
          )}
        </section>
      </header>

      {/* Warnings & Restrictions */}
      <WarningStrip insights={insights} />

      {/* Hero Metric: Exact Proposals */}
      <ExactProposalsCard activity={activity} viewerMode={insights.viewerMode} />

      {/* Applicant History */}
      {history?.summary && (
        <section
          className="rounded-xl border border-border bg-card p-3 shadow-xs text-card-foreground"
          aria-label="Applicant history"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-foreground">Applicant History</span>
            <span className="text-right text-[10px] text-muted-foreground">
              {historyTrackingLabel}
            </span>
          </div>
          <ApplicantHistoryChart captures={historyCaptures} />
          <div className={`mt-2 grid ${historyMetricGridClass} gap-2 text-center`}>
            {history.summary.firstSeenDelta !== null && (
              <MetricCell
                label="Total growth"
                value={`${history.summary.firstSeenDelta > 0 ? '↑ +' : ''}${formatNumber(history.summary.firstSeenDelta)}`}
              />
            )}
            {history.summary.recentDelta !== null && (
              <MetricCell
                label="Since last check"
                value={`${history.summary.recentDelta > 0 ? '↑ +' : ''}${formatNumber(history.summary.recentDelta)}`}
              />
            )}
            {history.velocity !== null && (
              <MetricCell label="Proposals/hour" value={history.velocity.toFixed(1)} />
            )}
            {history.summary.firstSeenDelta === null &&
              history.summary.recentDelta === null &&
              history.velocity === null && (
                <span className="col-span-full text-[11px] text-muted-foreground">
                  No trend yet
                </span>
              )}
          </div>
        </section>
      )}

      {insights.viewerMode === 'authenticated' && history && (
        <ConversionSummary stats={history.conversion} />
      )}

      {/* Client Track Record */}
      <ClientTrackRecordCard client={client} />

      {insights.viewerMode === 'visitor' && (
        <VisitorQualifications restrictions={job.restrictions} />
      )}

      {insights.viewerMode === 'authenticated' && history && (
        <section
          className="rounded-xl border border-border bg-card p-3.5 shadow-xs text-card-foreground"
          aria-labelledby="pay-profile-heading"
        >
          <div className="mb-3 flex items-center gap-1.5 border-b border-border/60 pb-2">
            <BuildingIcon className="size-3.5 text-muted-foreground" />
            <h2 id="pay-profile-heading" className="text-xs font-bold text-foreground">
              Client Pay Profile
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <MetricCell
              label="Typical Fixed Payment"
              value={formatMoney(history.payProfile.medianRecentFixedPayment, 'USD')}
            />
            <MetricCell
              label="Average Fixed Payment"
              value={formatMoney(history.payProfile.averageRecentFixedPayment, 'USD')}
            />
            <MetricCell
              label="Historical Hourly"
              value={
                history.payProfile.historicalHourlyRates
                  ? history.payProfile.historicalHourlyRates
                      .map((rate) => `${formatMoney(rate, 'USD')}/hr`)
                      .join(' · ')
                  : 'Not available'
              }
            />
          </div>
        </section>
      )}

      <FitSection insights={insights} personalization={personalization} />

      <AvailableTail insights={insights} clientHistory={clientHistory} />
    </div>
  );
}
