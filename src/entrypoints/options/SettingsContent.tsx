import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { PortfolioEntry, WatchlistRecord } from '../../lib/storage';
import type { ThemeMode } from '../../lib/theme';
import {
  PortfolioDraftForm,
  PortfolioItemCard,
  SettingsCard,
  SettingsHeader,
  SettingsNav,
  SettingsStatusAlert,
  type Status,
} from './SettingsComponents';
import { BookmarkIcon, BriefcaseIcon, DatabaseIcon, TrashIcon, UserIcon } from './SettingsIcons';

type PortfolioDraft = { title: string; skills: string; tags: string; url: string };

export interface SettingsContentProps {
  skills: string;
  setSkills: (skills: string) => void;
  fallbackRate: string;
  setFallbackRate: (rate: string) => void;
  profileDisabled: boolean;
  saveProfile: (event: FormEvent<HTMLFormElement>) => void;
  profileStatus: Status;
  portfolio: PortfolioEntry[];
  portfolioDisabled: boolean;
  startNewPortfolioEntry: () => void;
  editPortfolioEntry: (index: number) => void;
  deletePortfolioEntry: (index: number) => void | Promise<void>;
  portfolioDraft: PortfolioDraft;
  setPortfolioDraft: (draft: PortfolioDraft) => void;
  editingIndex: number | null;
  savePortfolioEntry: (event: FormEvent<HTMLFormElement>) => void;
  portfolioStatus: Status;
  watchlist: WatchlistRecord[];
  watchlistDisabled: boolean;
  removeWatchlistJob: (jobId: string) => void | Promise<void>;
  watchlistStatus: Status;
  clearDataDisabled: boolean;
  clearLocalData: () => void | Promise<void>;
  clearPending: boolean;
  clearStatus: Status;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}

export function SettingsContent({
  skills,
  setSkills,
  fallbackRate,
  setFallbackRate,
  profileDisabled,
  saveProfile,
  profileStatus,
  portfolio,
  portfolioDisabled,
  startNewPortfolioEntry,
  editPortfolioEntry,
  deletePortfolioEntry,
  portfolioDraft,
  setPortfolioDraft,
  editingIndex,
  savePortfolioEntry,
  portfolioStatus,
  watchlist,
  watchlistDisabled,
  removeWatchlistJob,
  watchlistStatus,
  clearDataDisabled,
  clearLocalData,
  clearPending,
  clearStatus,
  themeMode,
  onToggleTheme,
}: SettingsContentProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground antialiased sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <SettingsHeader themeMode={themeMode} onToggleTheme={onToggleTheme} />
        <SettingsNav />

        {/* Profile Section */}
        <SettingsCard
          id="profile"
          headingId="profile-heading"
          title="Your profile"
          description="Captured job rates remain primary; this rate is only a local fallback when none is posted."
          icon={UserIcon}
        >
          <form className="space-y-4" onSubmit={saveProfile}>
            <div>
              <label
                className="block text-xs font-semibold tracking-wide text-foreground/80 uppercase"
                htmlFor="profile-skills"
              >
                Skills
              </label>
              <Textarea
                id="profile-skills"
                className="mt-1.5 min-h-24"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="TypeScript, React, Node.js, GraphQL, APIs"
                aria-describedby="skills-help"
                disabled={profileDisabled}
              />
              <p id="skills-help" className="mt-1.5 text-xs text-muted-foreground">
                Separate skills with commas or new lines.
              </p>
            </div>

            <div>
              <label
                className="block text-xs font-semibold tracking-wide text-foreground/80 uppercase"
                htmlFor="fallback-rate"
              >
                Fallback hourly rate (USD)
              </label>
              <Input
                id="fallback-rate"
                className="mt-1.5"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={fallbackRate}
                onChange={(event) => setFallbackRate(event.target.value)}
                placeholder="e.g. 75.00 (leave blank for no fallback)"
                aria-describedby="rate-help"
                disabled={profileDisabled}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" size="default" disabled={profileDisabled}>
                Save profile
              </Button>
            </div>
            <SettingsStatusAlert status={profileStatus} />
          </form>
        </SettingsCard>

        {/* Portfolio Section */}
        <SettingsCard
          id="portfolio"
          headingId="portfolio-heading"
          title="Portfolio"
          description="Entries stay local. URLs are stored as text and never opened or fetched in the background."
          icon={BriefcaseIcon}
          badge={
            portfolio.length > 0 ? <Badge variant="secondary">{portfolio.length}</Badge> : null
          }
          actions={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={startNewPortfolioEntry}
              disabled={portfolioDisabled}
            >
              Add entry
            </Button>
          }
        >
          {portfolio.length > 0 ? (
            <ul className="space-y-2.5" aria-label="Saved portfolio entries">
              {portfolio.map((entry, index) => (
                <PortfolioItemCard
                  key={`${entry.title}:${entry.url ?? ''}:${entry.skills.join(',')}:${entry.tags.join(',')}`}
                  entry={entry}
                  index={index}
                  isEditing={editingIndex === index}
                  disabled={portfolioDisabled}
                  onEdit={editPortfolioEntry}
                  onDelete={deletePortfolioEntry}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center">
              <BriefcaseIcon className="mx-auto size-7 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-semibold text-foreground">No portfolio entries yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add your projects below to enable smart portfolio match suggestions in job details.
              </p>
            </div>
          )}

          {portfolio.length > 0 && <Separator className="my-6" />}

          {/* Portfolio Entry Form */}
          <PortfolioDraftForm
            draft={portfolioDraft}
            onChangeDraft={setPortfolioDraft}
            editingIndex={editingIndex}
            disabled={portfolioDisabled}
            onSubmit={savePortfolioEntry}
            onCancel={startNewPortfolioEntry}
            status={portfolioStatus}
          />
        </SettingsCard>

        {/* Watchlist Section */}
        <SettingsCard
          id="watchlist"
          headingId="watchlist-heading"
          title="Watchlist"
          description="Saved jobs stay on this device. Open a job page to review its latest insights."
          icon={BookmarkIcon}
          badge={
            watchlist.length > 0 ? <Badge variant="secondary">{watchlist.length}</Badge> : null
          }
        >
          {watchlist.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center">
              <BookmarkIcon className="mx-auto size-7 text-muted-foreground/60" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">No saved jobs yet.</p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Bookmark interesting opportunities from the extension popup to track them here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5" aria-label="Saved jobs">
              {watchlist.map((entry) => (
                <li
                  key={entry.jobId}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-border sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {entry.job.title ?? 'Untitled job'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-mono text-xs font-medium text-muted-foreground">
                        {entry.jobId}
                      </span>{' '}
                      · Saved{' '}
                      {Number.isFinite(entry.savedAt)
                        ? new Date(entry.savedAt).toLocaleDateString()
                        : 'date unavailable'}
                    </p>
                  </div>
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
                </li>
              ))}
            </ul>
          )}
          <SettingsStatusAlert status={watchlistStatus} />
        </SettingsCard>

        {/* Clear Local Data Section */}
        <SettingsCard
          id="data"
          headingId="clear-data-heading"
          title="Clear local data"
          description="Remove local history, jobs, applications, and watchlist data. Your profile, portfolio, and settings are preserved."
          icon={DatabaseIcon}
          variant="danger"
        >
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs leading-relaxed text-destructive">
            <p id="clear-data-help">
              This action clears locally stored job snapshots, historical application records, and
              watchlist entries. Your user profile, fallback rate, and portfolio remain untouched.
            </p>
          </div>
          <div className="mt-4">
            <Button
              type="button"
              variant="destructive"
              size="default"
              onClick={() => void clearLocalData()}
              disabled={clearDataDisabled}
              aria-describedby="clear-data-help"
              aria-busy={clearPending}
            >
              <TrashIcon className="size-4" />
              <span>{clearPending ? 'Clearing local data…' : 'Clear local data'}</span>
            </Button>
          </div>
          <SettingsStatusAlert status={clearStatus} />
        </SettingsCard>
      </div>
    </main>
  );
}
