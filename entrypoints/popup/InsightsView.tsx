import type { ReactNode } from 'react';
import {
  formatApplicationState,
  formatDate,
  formatJobStatus,
  formatMoney,
  formatNumber,
  formatPercent,
  formatRateContext,
  formatRating,
  formatRelativeTime,
} from '../../lib/format';
import type { ClientHistoryEntry, JobInsights, JobWarning } from '../../lib/insights';
import type { JobHistoryResponse } from '../../lib/protocol';
import type { QualificationDetail } from '../../lib/qualification';
import type { ThemeMode } from '../../lib/theme';

// --- Vector Icons ---

function ShieldCheckIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StarIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function AlertTriangleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckCircleIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function LockIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BuildingIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}

function TargetIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function RadarIcon({ className = 'size-6' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19.07 4.93a10 10 0 0 0-14.14 0" />
      <path d="M16.24 7.76a6 6 0 0 0-8.48 0" />
      <path d="M13.41 10.59a2 2 0 0 0-2.82 0" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );
}

function SunIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MonitorIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );
}

// --- Component Helpers ---

export type WatchlistStatus =
  | { kind: 'saved' }
  | { kind: 'not-saved' }
  | { kind: 'unavailable'; reason: 'missing-id' | 'storage' };

const WARNING_COPY: Record<JobWarning, string> = {
  'position-filled': 'Position already filled',
  'already-hired': 'Client already hired for this job',
  'already-applied': 'Already applied to this job',
  'client-invited': 'Client invited you to apply',
};

export function ThemeToggle({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const label =
    mode === 'dark'
      ? 'Theme: Dark (switch to Light)'
      : mode === 'light'
        ? 'Theme: Light (switch to System)'
        : 'Theme: System (switch to Dark)';

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex cursor-pointer items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10.5px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
      aria-label={label}
      title={label}
    >
      {mode === 'dark' && <MoonIcon className="size-3 text-indigo-400" />}
      {mode === 'light' && <SunIcon className="size-3 text-amber-500" />}
      {mode === 'system' && <MonitorIcon className="size-3 text-slate-400" />}
      <span className="capitalize">{mode}</span>
    </button>
  );
}

function MetricCell({
  label,
  value,
  subvalue,
  accent = false,
  icon,
}: {
  label: string;
  value: ReactNode;
  subvalue?: ReactNode;
  accent?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-[13px] font-semibold tracking-tight tabular-nums ${
            accent ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
          }`}
        >
          {value}
        </span>
        {subvalue && (
          <span className="text-[10.5px] font-normal text-slate-500 tabular-nums dark:text-slate-400">
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
}

function WarningStrip({ insights }: { insights: JobInsights }) {
  const warnings = insights.warnings.map((warning) => WARNING_COPY[warning]);
  const restrictions = insights.job.restrictions;
  const hasContent = warnings.length > 0 || restrictions.length > 0;

  if (!hasContent) return null;

  return (
    <aside
      className="mb-3 rounded-xl border border-amber-300/80 bg-amber-50/90 p-3 text-amber-950 shadow-xs dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200"
      aria-label="Important job notices"
      role="alert"
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <AlertTriangleIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-bold tracking-tight text-amber-900 dark:text-amber-200">
          Important Notice
        </span>
      </div>

      {warnings.length > 0 && (
        <ul className="m-0 mb-1.5 list-none space-y-1 p-0">
          {warnings.map((message) => (
            <li
              key={message}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-900 leading-snug dark:text-amber-200"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400" />
              <span>{message}</span>
            </li>
          ))}
        </ul>
      )}

      {restrictions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Requirements:
          </span>
          {restrictions.map((restriction) => (
            <span
              key={restriction}
              className="rounded-md border border-amber-200/90 bg-amber-100/80 px-2 py-0.5 text-[11px] font-medium text-amber-900 leading-none dark:border-amber-700/50 dark:bg-amber-900/40 dark:text-amber-300"
            >
              {restriction}
            </span>
          ))}
        </div>
      )}
    </aside>
  );
}

function HistoryRow({ job }: { job: ClientHistoryEntry }) {
  const isHourly = job.type?.toUpperCase() === 'HOURLY';
  const typeTag = isHourly ? 'Hourly' : 'Fixed';
  const formattedAmount = job.amountPaid === null ? null : formatMoney(job.amountPaid, 'USD');
  const formattedRating =
    job.feedbackScore === null ? null : `${formatRating(job.feedbackScore)} ★`;

  return (
    <li className="flex flex-col gap-1 border-b border-slate-100 py-2.5 first:pt-1 last:border-b-0 last:pb-1 dark:border-slate-800">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-slate-900 leading-tight line-clamp-2 dark:text-slate-200">
          {job.title ?? 'Untitled job'}
        </span>
        {formattedAmount && (
          <span className="shrink-0 rounded bg-slate-100/90 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-slate-900 dark:bg-slate-800 dark:text-slate-200">
            {formattedAmount}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-600 dark:text-slate-300">{typeTag}</span>
        {formattedRating && (
          <>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-0.5 font-medium tabular-nums text-amber-700 dark:text-amber-400">
              <StarIcon className="size-3 fill-amber-400 text-amber-500" />
              {formattedRating}
            </span>
          </>
        )}
        {job.status && (
          <>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="capitalize text-slate-400 dark:text-slate-500">
              {job.status.toLowerCase()}
            </span>
          </>
        )}
      </div>
    </li>
  );
}

function QualificationDetails({ details }: { details: QualificationDetail[] }) {
  if (details.length === 0) return null;

  return (
    <details className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
      <summary className="flex cursor-pointer list-none items-center justify-between px-2.5 py-2 text-xs font-semibold text-slate-700 select-none hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-700/60">
        <span>Qualification details</span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {details.length}
        </span>
      </summary>
      <ul className="m-0 list-none border-t border-slate-100 bg-white/70 px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900/50">
        {details.map((detail) => (
          <li
            key={`${detail.requirementName}:${detail.clientLabel}:${detail.freelancerLabel ?? ''}:${detail.matched}`}
            className="border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                {detail.requirementName}
              </span>
              <span
                className={`shrink-0 text-[10px] font-bold ${
                  detail.matched
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {detail.matched ? 'Matched' : 'Not matched'}
              </span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-x-2 text-[10.5px] leading-snug text-slate-500 dark:text-slate-400">
              <span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">Client: </span>
                {detail.clientLabel}
              </span>
              <span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Freelancer:{' '}
                </span>
                {detail.freelancerLabel ?? detail.freelancerValue ?? 'Not available'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}

function HistoryDetails({
  title,
  jobs,
  badgeText,
  defaultOpen = false,
}: {
  title: string;
  jobs: ClientHistoryEntry[];
  badgeText?: string;
  defaultOpen?: boolean;
}) {
  if (jobs.length === 0) return null;

  return (
    <details
      className="group mb-2.5 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-xs font-semibold text-slate-800 select-none hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-800/60">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badgeText && (
            <span className="rounded border border-indigo-200/70 bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 leading-none dark:border-indigo-800/70 dark:bg-indigo-950/60 dark:text-indigo-300">
              {badgeText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300">
            {jobs.length}
          </span>
          <ChevronDownIcon className="size-3.5 text-slate-400 transition-transform duration-200 group-open:rotate-180 dark:text-slate-500" />
        </div>
      </summary>
      <div className="border-t border-slate-100 bg-slate-50/40 px-3.5 py-2 dark:border-slate-800 dark:bg-slate-900/50">
        <ul className="m-0 list-none p-0" aria-label={title}>
          {jobs.map((job, index) => (
            <HistoryRow
              key={
                job.id ??
                `${job.title ?? 'untitled'}-${job.startedOn ?? index}-${job.amountPaid ?? 0}`
              }
              job={job}
            />
          ))}
        </ul>
      </div>
    </details>
  );
}

// --- Main State Views ---

export function EmptyState({
  title,
  copy,
  tone = 'default',
  themeMode,
  onToggleTheme,
  onRetry,
}: {
  title: string;
  copy: string;
  tone?: 'default' | 'error';
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  onRetry?: () => void;
}) {
  return (
    <section className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-6 text-center shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
      {themeMode && onToggleTheme && (
        <div className="mb-4 flex w-full justify-end">
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>
      )}

      <div
        className={`mb-4 flex size-12 items-center justify-center rounded-2xl shadow-inner ${
          tone === 'error'
            ? 'border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
            : 'border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
        }`}
        aria-hidden="true"
      >
        {tone === 'error' ? (
          <AlertTriangleIcon className="size-6" />
        ) : (
          <RadarIcon className="size-6" />
        )}
      </div>

      <h1 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <p
        className="mb-6 max-w-[32ch] text-xs leading-relaxed text-slate-500 dark:text-slate-400"
        role="status"
        aria-live="polite"
      >
        {copy}
      </p>

      {onRetry && (
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-100"
          onClick={onRetry}
        >
          Retry
        </button>
      )}

      {tone === 'default' && (
        <div className="mt-6 w-full rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-left dark:border-slate-800 dark:bg-slate-800/60">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            How it works
          </div>
          <ol className="m-0 list-decimal space-y-1.5 pl-4 text-xs text-slate-600 dark:text-slate-300">
            <li>Open any job post on Upwork.</li>
            <li>Let the page finish loading its details.</li>
            <li>Open this popup for instant authenticated signals.</li>
          </ol>
        </div>
      )}

      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <ShieldCheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>100% Local session data · No duplicate requests</span>
      </div>
    </section>
  );
}

export function LoadingState({
  themeMode,
  onToggleTheme,
}: {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  return (
    <section
      className="flex min-h-[460px] flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
      aria-busy="true"
      aria-label="Loading job insights"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
          {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="mb-1.5 h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mb-4 h-3.5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

      {/* Hero Skeleton */}
      <div className="mb-3 rounded-2xl bg-slate-900 p-4 ring-1 ring-white/10 dark:bg-slate-950 dark:ring-slate-800">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-700 dark:bg-slate-800" />
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-800 dark:bg-slate-800" />
        </div>
        <div className="my-3 h-10 w-20 animate-pulse rounded bg-slate-700 dark:bg-slate-800" />
        <div className="border-t border-slate-800 pt-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="h-6 animate-pulse rounded bg-slate-800" />
            <div className="h-6 animate-pulse rounded bg-slate-800" />
            <div className="h-6 animate-pulse rounded bg-slate-800" />
            <div className="h-6 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
      </div>
    </section>
  );
}

export function AvailableState({
  insights,
  history,
  historyFallback = false,
  watchlistStatus = { kind: 'not-saved' },
  watchlistBusy = false,
  onToggleWatchlist,
  themeMode,
  onToggleTheme,
}: {
  insights: JobInsights;
  history?: JobHistoryResponse | null;
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

  const qualificationSummary =
    fit.qualificationsMatched !== null && fit.qualificationsTotal !== null
      ? `${fit.qualificationsMatched}/${fit.qualificationsTotal}`
      : null;

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
            <span>Authenticated</span>
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
            <span className="text-[10px] font-medium text-slate-400">Interviewed</span>
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Applicant History
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {history.summary.snapshotCount} capture
              {history.summary.snapshotCount === 1 ? '' : 's'}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {history.summary.firstSeenDelta !== null && (
              <MetricCell
                label="Since first"
                value={`${history.summary.firstSeenDelta > 0 ? '+' : ''}${formatNumber(history.summary.firstSeenDelta)}`}
              />
            )}
            {history.summary.recentDelta !== null && (
              <MetricCell
                label="Since prior"
                value={`${history.summary.recentDelta > 0 ? '+' : ''}${formatNumber(history.summary.recentDelta)}`}
              />
            )}
            {history.velocity !== null && (
              <MetricCell label="Proposals/hour" value={history.velocity.toFixed(1)} />
            )}
            {history.summary.firstSeenDelta === null &&
              history.summary.recentDelta === null &&
              history.velocity === null && (
                <span className="col-span-3 text-[11px] text-slate-500 dark:text-slate-400">
                  No trend yet
                </span>
              )}
          </div>
        </section>
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
      {history && (
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

      {/* Your Fit & Rate Dynamics */}
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
          {/* Qualifications Match */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Qualifications Matched
            </span>
            <span className="rounded-md border border-slate-200/90 bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
              {qualificationSummary ?? 'Not available'}
            </span>
          </div>
          <QualificationDetails details={fit.qualificationDetails ?? []} />

          {/* Rate Comparison Box */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <div>
                <span className="block text-[10.5px] font-medium text-slate-500 dark:text-slate-400">
                  Your Hourly Rate
                </span>
                <span className="text-xs font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {formatMoney(fit.freelancerHourlyRate, 'USD')}
                </span>
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

            {fit.rateContext !== null && (
              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Rate Comparison
                </span>
                <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                  {formatRateContext(fit.rateContext)}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Expandable History Sections */}
      <HistoryDetails
        title="Related Previous Jobs"
        jobs={clientHistory.relatedJobs}
        badgeText="Repeat Context"
        defaultOpen={true}
      />

      <HistoryDetails
        title="Client Hiring History"
        jobs={clientHistory.recentJobs}
        defaultOpen={false}
      />

      {/* Footer */}
      <footer className="mt-1 flex flex-col gap-1 rounded-xl bg-slate-200/50 p-2.5 text-[10.5px] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span>Posted: {formatDate(job.postedOn)}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {job.budgetAmount === null
              ? 'Budget: Not provided'
              : `Budget: ${formatMoney(job.budgetAmount, job.budgetCurrency)}`}
          </span>
        </div>
        <div className="text-center text-[10px] text-slate-400 dark:text-slate-500">
          Local session insights · Authenticated GraphQL snapshot
        </div>
      </footer>
    </div>
  );
}
