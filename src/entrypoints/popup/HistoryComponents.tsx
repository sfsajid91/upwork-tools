import { Badge } from '@/components/ui/badge';
import { formatMoney, formatRating } from '../../lib/format';
import type { ClientHistoryEntry, SimilarJob } from '../../lib/insights';
import { ChevronDownIcon, StarIcon } from './PopupIcons';

export function HistoryRow({ job }: { job: ClientHistoryEntry }) {
  const isHourly = job.type?.toUpperCase() === 'HOURLY';
  const typeTag = isHourly ? 'Hourly' : 'Fixed';
  const formattedAmount = job.amountPaid === null ? null : formatMoney(job.amountPaid, 'USD');
  const formattedRating =
    job.feedbackScore === null ? null : `${formatRating(job.feedbackScore)} ★`;

  return (
    <li className="flex flex-col gap-1 border-b border-border/60 py-2.5 first:pt-1 last:border-b-0 last:pb-1">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-foreground leading-tight line-clamp-2">
          {job.title ?? 'Untitled job'}
        </span>
        {formattedAmount && (
          <span className="shrink-0 rounded bg-muted/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-foreground">
            {formattedAmount}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground/80">{typeTag}</span>
        {formattedRating && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span className="flex items-center gap-0.5 font-medium tabular-nums text-amber-700 dark:text-amber-400">
              <StarIcon className="size-3 fill-amber-400 text-amber-500" />
              {formattedRating}
            </span>
          </>
        )}
        {job.status && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span className="capitalize text-muted-foreground">{job.status.toLowerCase()}</span>
          </>
        )}
      </div>
    </li>
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
      className="group mb-2.5 overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-colors text-card-foreground"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-foreground select-none hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {badgeText && (
            <Badge
              variant="outline"
              className="border-indigo-500/30 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 text-[10px] font-semibold"
            >
              {badgeText}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] font-bold tabular-nums">
            {jobs.length}
          </Badge>
          <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
        </div>
      </summary>
      <div className="border-t border-border/60 bg-muted/20 px-3.5 py-2">
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
      className="group mb-2.5 overflow-hidden rounded-xl border border-border bg-card shadow-xs text-card-foreground"
      aria-label="Similar Opportunities"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-foreground select-none hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span>Similar Opportunities</span>
        <span className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] font-bold tabular-nums">
            {jobs.length}
          </Badge>
          <ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
        </span>
      </summary>
      <ul className="m-0 list-none border-t border-border/60 bg-muted/20 px-3.5 py-2">
        {jobs.map((job, index) => (
          <li
            key={job.id ?? job.ciphertext ?? `${job.title ?? 'untitled'}-${index}`}
            className="border-b border-border/40 py-2.5 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-foreground leading-tight">
                {job.title ?? 'Untitled job'}
              </span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
                {formatMoney(job.amount, job.currency)}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
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
