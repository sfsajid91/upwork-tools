import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatMoney, formatRelativeCaptureTime } from '../../lib/format';
import type { WatchlistRecord } from '../../lib/storage';
import { SettingsCard, SettingsStatusAlert, type Status } from './SettingsComponents';
import { BookmarkIcon, CheckIcon, CopyIcon, ExternalLinkIcon, TrashIcon } from './SettingsIcons';

export interface WatchlistSectionProps {
  watchlist: WatchlistRecord[];
  watchlistDisabled: boolean;
  removeWatchlistJob: (jobId: string) => void | Promise<void>;
  watchlistStatus: Status;
}

export function WatchlistSection({
  watchlist,
  watchlistDisabled,
  removeWatchlistJob,
  watchlistStatus,
}: WatchlistSectionProps) {
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

  async function handleCopyJobId(jobId: string) {
    try {
      await navigator.clipboard.writeText(jobId);
      setCopiedJobId(jobId);
      setTimeout(() => setCopiedJobId(null), 2000);
    } catch {
      // Fallback ignore if clipboard permission denied
    }
  }

  return (
    <SettingsCard
      id="watchlist"
      headingId="watchlist-heading"
      title="Watchlist"
      description="Saved jobs stay on this device. Open a job page to review its latest insights."
      icon={BookmarkIcon}
      badge={watchlist.length > 0 ? <Badge variant="secondary">{watchlist.length}</Badge> : null}
    >
      {watchlist.length === 0 ? (
        <div className="rounded-xl border border-border/80 border-dashed p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground/70">
            <BookmarkIcon className="size-6" />
          </div>
          <p className="mt-3 font-semibold text-foreground text-sm">No saved jobs yet.</p>
          <p className="mx-auto mt-1 max-w-sm text-muted-foreground text-xs leading-relaxed">
            Bookmark interesting opportunities from the extension popup while browsing Upwork to
            track them here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Saved jobs">
          {watchlist.map((entry) => {
            const jobUrl = `https://www.upwork.com/jobs/${entry.jobId}`;
            const isCopied = copiedJobId === entry.jobId;
            const formattedBudget =
              entry.job.budgetAmount !== null
                ? formatMoney(entry.job.budgetAmount, entry.job.budgetCurrency)
                : null;

            return (
              <li
                key={entry.jobId}
                className="group flex flex-col justify-between gap-3.5 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-border hover:shadow-2xs sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground text-sm tracking-tight">
                      {entry.job.title ?? 'Untitled job'}
                    </p>
                    {entry.job.type && (
                      <Badge variant="outline">
                        <span className="capitalize">{entry.job.type}</span>
                      </Badge>
                    )}
                    {formattedBudget && <Badge variant="secondary">{formattedBudget}</Badge>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                    {/* Copyable Job ID */}
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            onClick={() => void handleCopyJobId(entry.jobId)}
                            className="inline-flex min-h-[32px] cursor-pointer items-center gap-1 rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:min-h-0"
                            aria-label="Copy job ID"
                          />
                        }
                      >
                        <span>{entry.jobId}</span>
                        {isCopied ? (
                          <CheckIcon className="size-2.5 text-primary" />
                        ) : (
                          <CopyIcon className="size-2.5 opacity-60 group-hover:opacity-100" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{isCopied ? 'Copied to clipboard!' : 'Click to copy Job ID'}</p>
                      </TooltipContent>
                    </Tooltip>

                    <span>·</span>

                    <span>
                      Saved{' '}
                      {Number.isFinite(entry.savedAt)
                        ? `${formatRelativeCaptureTime(entry.savedAt)} (${new Date(entry.savedAt).toLocaleDateString()})`
                        : 'date unavailable'}
                    </span>
                  </div>
                </div>

                <div className="flex min-h-[44px] shrink-0 items-center gap-2 self-end sm:min-h-0 sm:self-center">
                  <a
                    href={jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'xs',
                    })}
                  >
                    <span>Open</span>
                    <ExternalLinkIcon className="size-3 text-muted-foreground" />
                  </a>

                  <Button
                    type="button"
                    variant="destructive"
                    size="xs"
                    onClick={() => void removeWatchlistJob(entry.jobId)}
                    disabled={watchlistDisabled}
                  >
                    <TrashIcon className="size-3" />
                    <span>Remove</span>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <SettingsStatusAlert status={watchlistStatus} />
    </SettingsCard>
  );
}
