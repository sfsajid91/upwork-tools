import {
  ConversionSummary,
  MetricCell,
  ThemeToggle,
  VisitorQualifications,
  WarningStrip,
  type PopupPersonalization,
  type WatchlistStatus,
} from './PopupComponents';
import { AvailableTail, FitSection } from './AvailableSections';
import { ApplicantHistoryChart } from './ApplicantHistoryChart';
import {
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  LockIcon,
  MapPinIcon,
  StarIcon,
} from './PopupIcons';
import {
  formatApplicationState,
  formatDate,
  formatJobStatus,
  formatMoney,
  formatNumber,
  formatPercent,
  formatRating,
  formatRelativeTime,
  formatTrackingSpan,
} from '../../lib/format';
import type { JobInsights } from '../../lib/insights';
import type { JobHistoryResponse } from '../../lib/protocol';
import type { ThemeMode } from '../../lib/theme';

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

  const location = [client.city, client.country].filter(Boolean).join(', ') || 'Not available';

  const isStatusFilled = job.status?.toUpperCase() === 'FILLED';
  const isStatusOpen = job.status?.toUpperCase() === 'OPEN';

  const statusBadge = (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold leading-tight ${
        isStatusFilled
          ? 'border border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/60 dark:text-amber-300'
          : isStatusOpen
            ? 'border border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/60 dark:text-emerald-300'
            : 'border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isStatusFilled
            ? 'bg-amber-600 dark:bg-amber-400'
            : isStatusOpen
              ? 'bg-emerald-600 dark:bg-emerald-400'
              : 'bg-slate-500'
        }`}
      />
      {formatJobStatus(job.status)}
    </span>
  );

  const subTitleParts = [job.type, job.contractorTier, job.category].filter(Boolean);
  const historyCaptures = history?.captures ?? [];
  const firstHistoryCapture = historyCaptures[0];
  const latestHistoryCapture = historyCaptures.at(-1);
  const historyTrackingLabel =
    history?.summary && historyCaptures.length === 1 && firstHistoryCapture
      ? `1 capture · First tracked ${formatRelativeTime(new Date(firstHistoryCapture.capturedAt).toISOString())}`
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
      {/* Header */}
      <header className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
              UPWORK TOOLS
            </span>
          </div>
          <div className="flex items-center gap-2">
            {themeMode && onToggleTheme && (
              <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
            )}
            {statusBadge}
            {insights.viewerMode === 'visitor' && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400"
                role="status"
              >
                Public Job View
              </span>
            )}
          </div>
        </div>

        <h1 className="text-[15px] font-bold leading-snug tracking-tight text-slate-900 line-clamp-2 dark:text-slate-100">
          {job.title ?? 'Untitled Job'}
        </h1>

        {subTitleParts.length > 0 && (
          <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {subTitleParts.join(' · ')}
          </p>
        )}
        {historyFallback && (
          <p
            className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900 dark:border-amber-900/80 dark:bg-amber-950/40 dark:text-amber-200"
            role="status"
            aria-live="polite"
          >
            Showing session-only insights. Optional history storage was unavailable.
          </p>
        )}
        <section
          className="mt-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60"
          aria-label="Local job controls"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="block text-[10.5px] font-bold text-slate-700 dark:text-slate-200">
                Watchlist
              </span>
              <span
                className="block text-[10px] text-slate-500 dark:text-slate-400"
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
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10.5px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label={watchlistLabel}
              title={watchlistLabel}
              disabled={!canToggleWatchlist || watchlistBusy}
              onClick={() => void onToggleWatchlist?.()}
            >
              <StarIcon className="size-3" />
              <span>
                {watchlistBusy
                  ? 'Saving…'
                  : effectiveWatchlistStatus.kind === 'saved'
                    ? 'Saved'
                    : 'Save'}
              </span>
            </button>
          </div>
          {insights.viewerMode === 'authenticated' && (
            <div
              className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-2 text-[10.5px] dark:border-slate-700/70"
              role="status"
              aria-label={observedApplicationLabel}
            >
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Observed application
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {formatApplicationState(fit.applicationState)}
              </span>
            </div>
          )}
        </section>
      </header>

      {/* Warnings & Restrictions */}
      <WarningStrip insights={insights} />

      {/* Hero Metric: Exact Proposals */}
      <section
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-4 text-white shadow-md ring-1 ring-white/10 dark:from-slate-950 dark:via-slate-950 dark:to-black dark:ring-slate-800"
        aria-labelledby="hero-proposals-heading"
      >
        <div className="flex items-center justify-between">
          <h2
            id="hero-proposals-heading"
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            <span>Exact Proposals</span>
          </h2>
          <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
            <LockIcon className="size-2.5" />
            <span>{insights.viewerMode === 'visitor' ? 'Public snapshot' : 'Authenticated'}</span>
          </div>
        </div>

        <div className="my-2.5 flex items-baseline justify-between">
          <div className="text-4xl font-extrabold tracking-tight tabular-nums text-white">
            {formatNumber(activity.exactProposals)}
          </div>
          {activity.interviewRate !== null && (
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-right">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-emerald-400/80">
                Interview Rate
              </span>
              <span className="text-sm font-bold tabular-nums text-emerald-300">
                {formatPercent(activity.interviewRate)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-800/90 pt-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-medium text-slate-400">Interviews</span>
            <span className="text-xs font-bold tabular-nums text-white">
              {formatNumber(activity.interviewed)}
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-800">
            <span className="text-[10px] font-medium text-slate-400">Hired</span>
            <span className="text-xs font-bold tabular-nums text-white">
              {formatNumber(activity.totalHired)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-medium text-slate-400">Positions</span>
            <span className="text-xs font-bold tabular-nums text-white">
              {formatNumber(activity.positionsToHire)}
            </span>
          </div>
        </div>

        {activity.lastBuyerActivity && (
          <div className="mt-2.5 flex items-center justify-center gap-1 text-[10.5px] text-slate-400">
            <ClockIcon className="size-3" />
            <span>Client active {formatRelativeTime(activity.lastBuyerActivity)}</span>
          </div>
        )}
      </section>
      {history?.summary && (
        <section
          className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
          aria-label="Applicant history"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Applicant History
            </span>
            <span className="text-right text-[10px] text-slate-500 dark:text-slate-400">
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
                <span className="col-span-full text-[11px] text-slate-500 dark:text-slate-400">
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
      <section
        className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
        aria-labelledby="client-heading"
      >
        <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <BuildingIcon className="size-3.5 text-slate-500 dark:text-slate-400" />
            <h2
              id="client-heading"
              className="text-xs font-bold text-slate-900 dark:text-slate-100"
            >
              Client Track Record
            </h2>
          </div>
          {client.topClient && (
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
              Top Client
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <MetricCell
            label="Payment Status"
            value={
              client.paymentVerified === true ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircleIcon className="size-3.5" />
                  <span>Verified</span>
                </span>
              ) : client.paymentVerified === false ? (
                <span className="text-slate-600 dark:text-slate-400">Unverified</span>
              ) : (
                'Not available'
              )
            }
          />

          <MetricCell
            label="Rating & Reviews"
            value={
              client.rating !== null ? (
                <span className="inline-flex items-center gap-1">
                  <StarIcon className="size-3 fill-amber-400 text-amber-500" />
                  <span>{formatRating(client.rating)}</span>
                </span>
              ) : (
                'Not available'
              )
            }
            subvalue={
              client.feedbackCount !== null
                ? `(${formatNumber(client.feedbackCount)} reviews)`
                : undefined
            }
          />

          <MetricCell
            label="Total Spend"
            value={formatMoney(client.totalCharges, 'USD')}
            accent={client.totalCharges !== null && client.totalCharges > 0}
          />

          <MetricCell
            label="Hire Rate"
            value={formatPercent(client.hireRate)}
            accent={client.hireRate !== null && client.hireRate >= 50}
            subvalue={
              client.totalJobsWithHires !== null && client.jobsPosted !== null
                ? `${formatNumber(client.totalJobsWithHires)}/${formatNumber(client.jobsPosted)} jobs`
                : undefined
            }
          />

          <MetricCell
            label="Avg Hourly Paid"
            value={formatMoney(client.averageHourlyRate, 'USD')}
          />

          <MetricCell label="Member Since" value={formatDate(client.memberSince)} />

          <div className="col-span-2 flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <MapPinIcon className="size-3 text-slate-400 dark:text-slate-500" />
            <span>{location}</span>
          </div>
        </div>
      </section>
      {insights.viewerMode === 'visitor' && (
        <VisitorQualifications restrictions={job.restrictions} />
      )}
      {insights.viewerMode === 'authenticated' && history && (
        <section
          className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
          aria-labelledby="pay-profile-heading"
        >
          <div className="mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2 dark:border-slate-800">
            <BuildingIcon className="size-3.5 text-slate-500 dark:text-slate-400" />
            <h2
              id="pay-profile-heading"
              className="text-xs font-bold text-slate-900 dark:text-slate-100"
            >
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
