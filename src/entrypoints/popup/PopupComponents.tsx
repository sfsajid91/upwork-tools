import type { ReactNode } from 'react';
import type { ConversionStats } from '../../lib/conversion';
import { formatMoney, formatNumber, formatPercent, formatRating } from '../../lib/format';
import type { ClientHistoryEntry, JobInsights, JobWarning, SimilarJob } from '../../lib/insights';
import type { PortfolioMatch } from '../../lib/portfolio-match';
import type { QualificationDetail } from '../../lib/qualification';
import type { SkillMatchSummary } from '../../lib/skill-match';
import type { ThemeMode } from '../../lib/theme';
import {
  AlertTriangleIcon,
  ChevronDownIcon,
  MonitorIcon,
  MoonIcon,
  StarIcon,
  SunIcon,
} from './PopupIcons';

// --- Component Helpers ---

export type WatchlistStatus =
  | { kind: 'saved' }
  | { kind: 'not-saved' }
  | { kind: 'unavailable'; reason: 'missing-id' | 'storage' };
export interface PopupPersonalization {
  fallbackHourlyRate: number | null;
  skillMatch: SkillMatchSummary | null;
  portfolioMatches: PortfolioMatch[];
}
export const EMPTY_POPUP_PERSONALIZATION: PopupPersonalization = {
  fallbackHourlyRate: null,
  skillMatch: null,
  portfolioMatches: [],
};

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

export function MetricCell({
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

export function WarningStrip({ insights }: { insights: JobInsights }) {
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

export function QualificationDetails({ details }: { details: QualificationDetail[] }) {
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
function externalPortfolioUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.hostname.length > 0 && (url.protocol === 'http:' || url.protocol === 'https:')
      ? value
      : null;
  } catch {
    return null;
  }
}

export function PortfolioMatches({ matches }: { matches: PortfolioMatch[] }) {
  if (matches.length === 0) return null;

  return (
    <details className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
      <summary className="flex cursor-pointer list-none items-center justify-between px-2.5 py-2 text-xs font-semibold text-slate-700 select-none hover:bg-slate-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-700/60">
        <span>Matching portfolio work</span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {matches.length}
        </span>
      </summary>
      <ul className="m-0 list-none border-t border-slate-100 bg-white/70 px-2.5 py-1 dark:border-slate-800 dark:bg-slate-900/50">
        {matches.map((match) => {
          const overlapLabels = [
            ...match.titleOverlap.map((label) => `Title: ${label}`),
            ...match.skillOverlap.map((label) => `Skill: ${label}`),
            ...match.tagOverlap.map((label) => `Tag: ${label}`),
          ];
          const portfolioUrl = externalPortfolioUrl(match.url);
          return (
            <li
              key={`${match.title}:${match.url ?? ''}:${match.titleOverlap.join(',')}:${match.skillOverlap.join(',')}:${match.tagOverlap.join(',')}`}
              className="border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800"
            >
              {portfolioUrl ? (
                <a
                  className="block text-[11px] font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-600 dark:text-emerald-300 dark:decoration-emerald-700 dark:hover:text-emerald-200"
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {match.title}
                </a>
              ) : (
                <span className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  {match.title}
                </span>
              )}
              <span className="mt-0.5 block text-[10.5px] text-slate-500 dark:text-slate-400">
                {overlapLabels.join(' · ')}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

export function ConversionSummary({ stats }: { stats: ConversionStats }) {
  // The tracker cannot observe a current-user interview yet; zero is unknown, not none.
  const interviewMetricsAvailable = stats.interviews > 0;
  return (
    <section
      className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
      aria-labelledby="conversion-heading"
    >
      <div className="mb-2 border-b border-slate-100 pb-2 dark:border-slate-800">
        <h2
          id="conversion-heading"
          className="text-xs font-bold text-slate-900 dark:text-slate-100"
        >
          Application Outcomes
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <MetricCell label="Applications" value={formatNumber(stats.applications)} />
        <MetricCell
          label="Interviews"
          value={interviewMetricsAvailable ? formatNumber(stats.interviews) : 'Not available'}
          subvalue={interviewMetricsAvailable ? undefined : 'Not tracked'}
        />
        <MetricCell label="Hires" value={formatNumber(stats.hires)} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <MetricCell
          label="Apply → Interview"
          value={
            interviewMetricsAvailable ? formatPercent(stats.applyToInterviewRate) : 'Not available'
          }
          subvalue={
            interviewMetricsAvailable
              ? `n=${formatNumber(stats.applyToInterviewDenominator)}`
              : 'Not tracked'
          }
        />
        <MetricCell
          label="Interview → Hire"
          value={
            interviewMetricsAvailable ? formatPercent(stats.interviewToHireRate) : 'Not available'
          }
          subvalue={
            interviewMetricsAvailable
              ? `n=${formatNumber(stats.interviewToHireDenominator)}`
              : 'Not tracked'
          }
        />
      </div>
    </section>
  );
}

export function HistoryDetails({
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
export function SimilarOpportunities({ jobs }: { jobs: SimilarJob[] }) {
  if (jobs.length === 0) return null;

  return (
    <details
      className="group mb-2.5 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
      aria-label="Similar Opportunities"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-3 text-xs font-semibold text-slate-800 select-none hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:text-slate-200 dark:hover:bg-slate-800/60">
        <span>Similar Opportunities</span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300">
            {jobs.length}
          </span>
          <ChevronDownIcon className="size-3.5 text-slate-400 transition-transform duration-200 group-open:rotate-180 dark:text-slate-500" />
        </span>
      </summary>
      <ul className="m-0 list-none border-t border-slate-100 bg-slate-50/40 px-3.5 py-2 dark:border-slate-800 dark:bg-slate-900/50">
        {jobs.map((job, index) => (
          <li
            key={job.id ?? job.ciphertext ?? `${job.title ?? 'untitled'}-${index}`}
            className="border-b border-slate-100 py-2.5 last:border-b-0 dark:border-slate-800"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-slate-900 leading-tight dark:text-slate-200">
                {job.title ?? 'Untitled job'}
              </span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-900 dark:text-slate-200">
                {formatMoney(job.amount, job.currency)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function VisitorQualifications({ restrictions }: { restrictions: string[] }) {
  return (
    <section
      className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
      aria-labelledby="qualifications-heading"
    >
      <div className="mb-2 border-b border-slate-100 pb-2 dark:border-slate-800">
        <h2
          id="qualifications-heading"
          className="text-xs font-bold text-slate-900 dark:text-slate-100"
        >
          Qualifications
        </h2>
      </div>
      {restrictions.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {restrictions.map((restriction) => (
            <li
              key={restriction}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {restriction}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-[11px] text-slate-500 dark:text-slate-400">Not available</span>
      )}
    </section>
  );
}
