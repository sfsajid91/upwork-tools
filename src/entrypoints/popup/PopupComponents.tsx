import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
import { formatNumber, formatPercent } from '../../lib/format';
import type { ConversionStats } from '../../lib/conversion';
import type { JobInsights, JobWarning } from '../../lib/insights';
import type { PortfolioMatch } from '../../lib/portfolio-match';
import type { QualificationDetail } from '../../lib/qualification';
import type { ThemeMode } from '../../lib/theme';
import { AlertTriangleIcon, ExternalLinkIcon, MonitorIcon, MoonIcon, SunIcon } from './PopupIcons';
export { HistoryDetails, HistoryRow, SimilarOpportunities } from './HistoryComponents';

// --- Component Helpers ---

export type WatchlistStatus =
  | { kind: 'saved' }
  | { kind: 'not-saved' }
  | { kind: 'unavailable'; reason: 'missing-id' | 'storage' };

export interface PopupPersonalization {
  fallbackHourlyRate: number | null;
  skillMatch: { matched: number; total: number; matchedSkills: string[] } | null;
  portfolioMatches: PortfolioMatch[];
}

export const EMPTY_POPUP_PERSONALIZATION: PopupPersonalization = {
  fallbackHourlyRate: null,
  skillMatch: null,
  portfolioMatches: [],
};

const WARNING_COPY: Record<JobWarning, string> = {
  'position-filled': 'Position already filled',
  'already-hired': 'Client already hired someone',
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
    <Button
      type="button"
      variant="outline"
      size="xs"
      onClick={onToggle}
      className="rounded-full gap-1"
      aria-label={label}
      title={label}
    >
      {mode === 'dark' && <MoonIcon className="size-3 text-indigo-400" />}
      {mode === 'light' && <SunIcon className="size-3 text-amber-500" />}
      {mode === 'system' && <MonitorIcon className="size-3 text-muted-foreground" />}
      <span className="capitalize">{mode}</span>
    </Button>
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
      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-[13px] font-semibold tracking-tight tabular-nums ${
            accent ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'
          }`}
        >
          {value}
        </span>
        {subvalue && (
          <span className="text-[10.5px] font-normal text-muted-foreground tabular-nums">
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

export function QualificationDetails({ details }: { details: QualificationDetail[] }) {
  if (details.length === 0) return null;

  return (
    <details className="overflow-hidden rounded-lg border border-border/60 bg-muted/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-2.5 py-2 text-xs font-semibold text-foreground select-none hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>Qualification details</span>
        <Badge variant="secondary" className="text-[10px] font-bold">
          {details.length}
        </Badge>
      </summary>
      <ul className="m-0 list-none border-t border-border/60 bg-card px-2.5 py-1">
        {details.map((detail) => (
          <li
            key={`${detail.requirementName}:${detail.clientLabel}:${detail.freelancerLabel ?? ''}:${detail.matched}`}
            className="border-b border-border/40 py-2 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-semibold text-foreground">
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
            <div className="mt-1 grid grid-cols-2 gap-x-2 text-[10.5px] leading-snug text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground/80">Client: </span>
                {detail.clientLabel}
              </span>
              <span>
                <span className="font-semibold text-foreground/80">Freelancer: </span>
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
    <details className="overflow-hidden rounded-lg border border-border/60 bg-muted/40">
      <summary className="flex cursor-pointer list-none items-center justify-between px-2.5 py-2 text-xs font-semibold text-foreground select-none hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>Matching portfolio work</span>
        <Badge variant="secondary" className="text-[10px] font-bold">
          {matches.length}
        </Badge>
      </summary>
      <ul className="m-0 list-none border-t border-border/60 bg-card px-2.5 py-1">
        {matches.map((match) => {
          const overlapLabels = [
            ...match.titleOverlap.map((label: string) => `Title: ${label}`),
            ...match.skillOverlap.map((label: string) => `Skill: ${label}`),
            ...match.tagOverlap.map((label: string) => `Tag: ${label}`),
          ];
          const portfolioUrl = externalPortfolioUrl(match.url);
          return (
            <li
              key={`${match.title}:${match.url ?? ''}:${match.titleOverlap.join(',')}:${match.skillOverlap.join(',')}:${match.tagOverlap.join(',')}`}
              className="border-b border-border/40 py-2 last:border-b-0"
            >
              {portfolioUrl ? (
                <a
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 hover:text-emerald-600 dark:text-emerald-300 dark:decoration-emerald-700 dark:hover:text-emerald-200"
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{match.title}</span>
                  <ExternalLinkIcon className="size-2.5 opacity-70" />
                </a>
              ) : (
                <span className="block text-[11px] font-semibold text-foreground">
                  {match.title}
                </span>
              )}
              <span className="mt-0.5 block text-[10.5px] text-muted-foreground">
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
      className="rounded-xl border border-border bg-card p-3 shadow-xs text-card-foreground"
      aria-labelledby="conversion-heading"
    >
      <div className="mb-2 border-b border-border/60 pb-2">
        <h2 id="conversion-heading" className="text-xs font-bold text-foreground">
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
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
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

export function VisitorQualifications({ restrictions }: { restrictions: string[] }) {
  return (
    <section
      className="rounded-xl border border-border bg-card p-3.5 shadow-xs text-card-foreground"
      aria-labelledby="qualifications-heading"
    >
      <div className="mb-2 border-b border-border/60 pb-2">
        <h2 id="qualifications-heading" className="text-xs font-bold text-foreground">
          Qualifications
        </h2>
      </div>
      {restrictions.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {restrictions.map((restriction) => (
            <li
              key={restriction}
              className="rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] text-foreground"
            >
              {restriction}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-[11px] text-muted-foreground">Not available</span>
      )}
    </section>
  );
}
