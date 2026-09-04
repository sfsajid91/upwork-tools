import type { FormEvent } from 'react';
import type { PortfolioEntry, WatchlistRecord } from '../../lib/storage';

type Status = { tone: 'success' | 'error'; message: string } | null;
type PortfolioDraft = { title: string; skills: string; tags: string; url: string };

export interface OptionsContentProps {
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
}

export function OptionsContent({
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
}: OptionsContentProps) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl space-y-5">
        <header>
          <h1 className="text-xl font-bold tracking-tight">Upwork Tools settings</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Keep your profile and portfolio on this device. Nothing is sent to Upwork or a backend.
          </p>
        </header>

        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="text-base font-semibold">
            Your profile
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Captured job rates remain primary; this rate is only a local fallback.
          </p>
          <form className="mt-4 space-y-3" onSubmit={saveProfile}>
            <div>
              <label className="text-sm font-medium" htmlFor="profile-skills">
                Skills
              </label>
              <textarea
                id="profile-skills"
                className="mt-1 block min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="TypeScript, React, APIs"
                aria-describedby="skills-help"
                disabled={profileDisabled}
              />
              <p id="skills-help" className="mt-1 text-xs text-slate-500">
                Separate skills with commas or new lines.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="fallback-rate">
                Fallback hourly rate (USD)
              </label>
              <input
                id="fallback-rate"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={fallbackRate}
                onChange={(event) => setFallbackRate(event.target.value)}
                placeholder="Leave blank for no fallback"
                aria-describedby="rate-help"
                disabled={profileDisabled}
              />
              <p id="rate-help" className="mt-1 text-xs text-slate-500">
                Leave blank to clear the fallback.
              </p>
            </div>
            <button
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={profileDisabled}
            >
              Save profile
            </button>
            {profileStatus && (
              <p
                className={
                  profileStatus.tone === 'error'
                    ? 'text-sm text-red-700 dark:text-red-300'
                    : 'text-sm text-emerald-700 dark:text-emerald-300'
                }
                role={profileStatus.tone === 'error' ? 'alert' : 'status'}
              >
                {profileStatus.message}
              </p>
            )}
          </form>
        </section>

        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-labelledby="portfolio-heading"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="portfolio-heading" className="text-base font-semibold">
                Portfolio
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Entries stay local. URLs are stored as text and never opened or fetched here.
              </p>
            </div>
            <button
              className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={startNewPortfolioEntry}
              disabled={portfolioDisabled}
            >
              Add entry
            </button>
          </div>

          {portfolio.length > 0 && (
            <ul className="mt-4 space-y-2" aria-label="Saved portfolio entries">
              {portfolio.map((entry, index) => (
                <li
                  className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800"
                  key={`${entry.title}:${entry.url ?? ''}:${entry.skills.join(',')}:${entry.tags.join(',')}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{entry.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {[...entry.skills, ...entry.tags].join(' · ') || 'No skills or tags listed'}
                    </p>
                    {entry.url && (
                      <p className="mt-1 truncate text-xs text-slate-500">{entry.url}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      className="rounded border border-slate-300 px-2 py-1 text-xs font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={() => editPortfolioEntry(index)}
                      disabled={portfolioDisabled}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={() => void deletePortfolioEntry(index)}
                      disabled={portfolioDisabled}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form
            className="mt-4 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800"
            onSubmit={savePortfolioEntry}
          >
            <h3 className="text-sm font-semibold">
              {editingIndex === null ? 'Add portfolio entry' : 'Edit portfolio entry'}
            </h3>
            <div>
              <label className="text-sm font-medium" htmlFor="portfolio-title">
                Title
              </label>
              <input
                id="portfolio-title"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950"
                value={portfolioDraft.title}
                onChange={(event) =>
                  setPortfolioDraft({ ...portfolioDraft, title: event.target.value })
                }
                required
                disabled={portfolioDisabled}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="portfolio-skills">
                  Skills
                </label>
                <input
                  id="portfolio-skills"
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950"
                  value={portfolioDraft.skills}
                  onChange={(event) =>
                    setPortfolioDraft({ ...portfolioDraft, skills: event.target.value })
                  }
                  placeholder="React, TypeScript"
                  disabled={portfolioDisabled}
                />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="portfolio-tags">
                  Tags
                </label>
                <input
                  id="portfolio-tags"
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950"
                  value={portfolioDraft.tags}
                  onChange={(event) =>
                    setPortfolioDraft({ ...portfolioDraft, tags: event.target.value })
                  }
                  placeholder="Dashboard, API"
                  disabled={portfolioDisabled}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="portfolio-url">
                URL <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <input
                id="portfolio-url"
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-950"
                type="url"
                inputMode="url"
                value={portfolioDraft.url}
                onChange={(event) =>
                  setPortfolioDraft({ ...portfolioDraft, url: event.target.value })
                }
                placeholder="https://example.com/project"
                aria-describedby="portfolio-url-help"
                disabled={portfolioDisabled}
              />
              <p id="portfolio-url-help" className="mt-1 text-xs text-slate-500">
                Only http(s) URLs are accepted.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={portfolioDisabled}
              >
                {editingIndex === null ? 'Add portfolio entry' : 'Save changes'}
              </button>
              {editingIndex !== null && (
                <button
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={startNewPortfolioEntry}
                  disabled={portfolioDisabled}
                >
                  Cancel
                </button>
              )}
            </div>
            {portfolioStatus && (
              <p
                className={
                  portfolioStatus.tone === 'error'
                    ? 'text-sm text-red-700 dark:text-red-300'
                    : 'text-sm text-emerald-700 dark:text-emerald-300'
                }
                role={portfolioStatus.tone === 'error' ? 'alert' : 'status'}
              >
                {portfolioStatus.message}
              </p>
            )}
          </form>
        </section>

        <section
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          aria-labelledby="watchlist-heading"
        >
          <h2 id="watchlist-heading" className="text-base font-semibold">
            Watchlist
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Saved jobs stay on this device. Open a job page to review its latest insights.
          </p>
          {watchlist.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">No saved jobs yet.</p>
          ) : (
            <ul className="mt-4 space-y-2" aria-label="Saved jobs">
              {watchlist.map((entry) => (
                <li
                  key={entry.jobId}
                  className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {entry.job.title ?? 'Untitled job'}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {entry.jobId} · Saved{' '}
                      {Number.isFinite(entry.savedAt)
                        ? new Date(entry.savedAt).toLocaleDateString()
                        : 'date unavailable'}
                    </p>
                  </div>
                  <button
                    className="shrink-0 rounded border border-red-300 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={() => void removeWatchlistJob(entry.jobId)}
                    disabled={watchlistDisabled}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {watchlistStatus && (
            <p
              className={
                watchlistStatus.tone === 'error'
                  ? 'mt-3 text-sm text-red-700 dark:text-red-300'
                  : 'mt-3 text-sm text-emerald-700 dark:text-emerald-300'
              }
              role={watchlistStatus.tone === 'error' ? 'alert' : 'status'}
            >
              {watchlistStatus.message}
            </p>
          )}
        </section>

        <section
          className="rounded-xl border border-red-200 bg-white p-4 shadow-sm dark:border-red-950 dark:bg-slate-900"
          aria-labelledby="clear-data-heading"
        >
          <h2 id="clear-data-heading" className="text-base font-semibold">
            Clear local data
          </h2>
          <p id="clear-data-help" className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Remove local history, jobs, applications, and watchlist data. Your profile, portfolio,
            and settings are preserved.
          </p>
          <button
            className="mt-3 rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={() => void clearLocalData()}
            disabled={clearDataDisabled}
            aria-describedby="clear-data-help"
            aria-busy={clearPending}
          >
            {clearPending ? 'Clearing local data…' : 'Clear local data'}
          </button>
          {clearStatus && (
            <p
              className={
                clearStatus.tone === 'error'
                  ? 'mt-3 text-sm text-red-700 dark:text-red-300'
                  : 'mt-3 text-sm text-emerald-700 dark:text-emerald-300'
              }
              role={clearStatus.tone === 'error' ? 'alert' : 'status'}
            >
              {clearStatus.message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
