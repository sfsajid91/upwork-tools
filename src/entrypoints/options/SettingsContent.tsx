import type { FormEvent } from 'react';
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
  setSkills: (value: string) => void;
  fallbackRate: string;
  setFallbackRate: (value: string) => void;
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
    <main className="min-h-screen bg-slate-50/70 px-4 py-8 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 sm:px-8 sm:py-12">
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
                className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
                htmlFor="profile-skills"
              >
                Skills
              </label>
              <textarea
                id="profile-skills"
                className="mt-1.5 block min-h-24 w-full rounded-xl border border-slate-300/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="TypeScript, React, Node.js, GraphQL, APIs"
                aria-describedby="skills-help"
                disabled={profileDisabled}
              />
              <p id="skills-help" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Separate skills with commas or new lines.
              </p>
            </div>

            <div>
              <label
                className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
                htmlFor="fallback-rate"
              >
                Fallback hourly rate (USD)
              </label>
              <div className="relative mt-1.5 flex rounded-xl shadow-2xs">
                <span className="inline-flex items-center rounded-l-xl border border-r-0 border-slate-300/80 bg-slate-100/80 px-3.5 text-sm font-semibold text-slate-600 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-400">
                  $
                </span>
                <input
                  id="fallback-rate"
                  className="block w-full rounded-r-xl border border-slate-300/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
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
              <p id="rate-help" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Leave blank to clear the fallback rate.
              </p>
            </div>

            <div className="pt-2">
              <button
                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-500 active:translate-y-px focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-slate-900"
                type="submit"
                disabled={profileDisabled}
              >
                Save profile
              </button>
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
            portfolio.length > 0 ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {portfolio.length}
              </span>
            ) : null
          }
          actions={
            <button
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:translate-y-px focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 sm:text-sm"
              type="button"
              onClick={startNewPortfolioEntry}
              disabled={portfolioDisabled}
            >
              Add entry
            </button>
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
            <div className="rounded-xl border border-dashed border-slate-300/80 p-6 text-center dark:border-slate-800">
              <BriefcaseIcon className="mx-auto size-7 text-slate-400 dark:text-slate-600" />
              <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                No portfolio entries yet
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Add your projects below to enable smart portfolio match suggestions in job details.
              </p>
            </div>
          )}

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
            watchlist.length > 0 ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {watchlist.length}
              </span>
            ) : null
          }
        >
          {watchlist.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300/80 p-6 text-center dark:border-slate-800">
              <BookmarkIcon className="mx-auto size-7 text-slate-400 dark:text-slate-600" />
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                No saved jobs yet.
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Bookmark interesting opportunities from the extension popup to track them here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5" aria-label="Saved jobs">
              {watchlist.map((entry) => (
                <li
                  key={entry.jobId}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-slate-300 sm:flex-row sm:items-center dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {entry.job.title ?? 'Untitled job'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {entry.jobId}
                      </span>{' '}
                      · Saved{' '}
                      {Number.isFinite(entry.savedAt)
                        ? new Date(entry.savedAt).toLocaleDateString()
                        : 'date unavailable'}
                    </p>
                  </div>
                  <button
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 hover:text-rose-800 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
                    type="button"
                    onClick={() => void removeWatchlistJob(entry.jobId)}
                    disabled={watchlistDisabled}
                  >
                    <TrashIcon className="size-3" />
                    <span>Remove</span>
                  </button>
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
          <div className="rounded-xl border border-rose-200/70 bg-rose-50/40 p-4 text-xs leading-relaxed text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
            <p id="clear-data-help">
              This action clears locally stored job snapshots, historical application records, and
              watchlist entries. Your user profile, fallback rate, and portfolio remain untouched.
            </p>
          </div>
          <div className="mt-4">
            <button
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-2xs transition-all hover:bg-rose-100 active:translate-y-px focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/80 dark:focus-visible:ring-offset-slate-900"
              type="button"
              onClick={() => void clearLocalData()}
              disabled={clearDataDisabled}
              aria-describedby="clear-data-help"
              aria-busy={clearPending}
            >
              <TrashIcon className="size-4" />
              <span>{clearPending ? 'Clearing local data…' : 'Clear local data'}</span>
            </button>
          </div>
          <SettingsStatusAlert status={clearStatus} />
        </SettingsCard>
      </div>
    </main>
  );
}
