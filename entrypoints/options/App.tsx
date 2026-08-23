import { type FormEvent, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { createPortfolio, removePortfolio, updatePortfolio } from '../../lib/portfolio';
import { isPortfolioEntry, isUserProfile, setUserProfile } from '../../lib/settings';
import type { PortfolioEntry, UserProfile } from '../../lib/storage';

type Status = { tone: 'success' | 'error'; message: string } | null;
type PortfolioDraft = { title: string; skills: string; tags: string; url: string };

const EMPTY_DRAFT: PortfolioDraft = { title: '', skills: '', tags: '', url: '' };

export function isOptionsProfile(value: unknown): value is UserProfile {
  return isUserProfile(value) && (value.hourlyRate === null || value.hourlyRate >= 0);
}

export function isHttpPortfolioUrl(url: string | null): boolean {
  if (url === null) return true;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.length > 0 && (parsed.protocol === 'http:' || parsed.protocol === 'https:')
    );
  } catch {
    return false;
  }
}

export function isOptionsPortfolioEntry(value: unknown): value is PortfolioEntry {
  return (
    isPortfolioEntry(value) &&
    value.title.trim().length > 0 &&
    value.skills.every((skill) => skill.trim().length > 0) &&
    value.tags.every((tag) => tag.trim().length > 0) &&
    isHttpPortfolioUrl(value.url)
  );
}
type LocalStorageArea = { get(keys: string | string[]): Promise<Record<string, unknown>> };

async function readOptionsData(): Promise<{
  profile: UserProfile | null;
  portfolio: PortfolioEntry[];
}> {
  const area = (browser as unknown as { storage?: { local?: LocalStorageArea } }).storage?.local;
  if (!area) throw new Error('Local storage is unavailable');
  const values = await area.get(['userProfile', 'portfolio']);
  const storedPortfolio = values.portfolio;
  return {
    profile: isOptionsProfile(values.userProfile) ? values.userProfile : null,
    portfolio:
      Array.isArray(storedPortfolio) && storedPortfolio.every(isOptionsPortfolioEntry)
        ? storedPortfolio.map((entry) => ({
            ...entry,
            skills: [...entry.skills],
            tags: [...entry.tags],
          }))
        : [],
  };
}

export function splitList(value: string): string[] {
  return [
    ...new Set(
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

export function parseHourlyRate(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const rate = Number(trimmed);
  return Number.isFinite(rate) && rate >= 0 ? rate : Number.NaN;
}

export function validatePortfolioDraft(draft: PortfolioDraft): string | null {
  if (!draft.title.trim()) return 'Add a title for this portfolio entry.';
  return isHttpPortfolioUrl(draft.url.trim() || null)
    ? null
    : 'Use an http:// or https:// portfolio URL.';
}
export function adjustEditingIndex(current: number | null, removed: number): number | null {
  if (current === null || current === removed) return null;
  return current > removed ? current - 1 : current;
}

function toPortfolioEntry(draft: PortfolioDraft): PortfolioEntry {
  return {
    title: draft.title.trim(),
    skills: splitList(draft.skills),
    tags: splitList(draft.tags),
    url: draft.url.trim() || null,
  };
}

function draftFromEntry(entry: PortfolioEntry): PortfolioDraft {
  return {
    title: entry.title,
    skills: entry.skills.join(', '),
    tags: entry.tags.join(', '),
    url: entry.url ?? '',
  };
}

function OptionsApp() {
  const [skills, setSkills] = useState('');
  const [fallbackRate, setFallbackRate] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    hourlyRate: null,
    skills: [],
    preferences: {},
  });
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [portfolioDraft, setPortfolioDraft] = useState<PortfolioDraft>(EMPTY_DRAFT);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [profileStatus, setProfileStatus] = useState<Status>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [portfolioStatus, setPortfolioStatus] = useState<Status>(null);
  const [portfolioSaving, setPortfolioSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { profile: storedProfile, portfolio: storedPortfolio } = await readOptionsData();
        if (cancelled) return;
        if (storedProfile) {
          setProfile(storedProfile);
          setSkills(storedProfile.skills.join(', '));
          setFallbackRate(
            storedProfile.hourlyRate === null ? '' : String(storedProfile.hourlyRate),
          );
        }
        setPortfolio(storedPortfolio);
      } catch {
        if (!cancelled) {
          setLoadFailed(true);
          setProfileStatus({
            tone: 'error',
            message: 'Local storage could not be read. Your changes were not loaded.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profileSaving) return;
    setProfileSaving(true);
    try {
      const hourlyRate = parseHourlyRate(fallbackRate);
      if (Number.isNaN(hourlyRate)) {
        setProfileStatus({
          tone: 'error',
          message: 'Enter a non-negative hourly rate, or leave it blank.',
        });
        return;
      }
      const nextProfile = { ...profile, hourlyRate, skills: splitList(skills) };
      const saved = await setUserProfile(nextProfile);
      setProfileStatus(
        saved
          ? { tone: 'success', message: 'Profile saved locally.' }
          : { tone: 'error', message: 'Local storage could not save your profile. Try again.' },
      );
      if (saved) setProfile(nextProfile);
    } finally {
      setProfileSaving(false);
    }
  }

  function startNewPortfolioEntry() {
    setEditingIndex(null);
    setPortfolioDraft({ ...EMPTY_DRAFT });
    setPortfolioStatus(null);
  }

  function editPortfolioEntry(index: number) {
    const entry = portfolio[index];
    if (!entry) return;
    setEditingIndex(index);
    setPortfolioDraft(draftFromEntry(entry));
    setPortfolioStatus(null);
  }

  async function savePortfolioEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (portfolioSaving) return;
    setPortfolioSaving(true);
    try {
      const validationError = validatePortfolioDraft(portfolioDraft);
      if (validationError) {
        setPortfolioStatus({ tone: 'error', message: validationError });
        return;
      }
      const entry = toPortfolioEntry(portfolioDraft);
      const saved =
        editingIndex === null
          ? await createPortfolio(entry)
          : await updatePortfolio(editingIndex, entry);
      if (!saved) {
        setPortfolioStatus({
          tone: 'error',
          message: 'Local storage could not save this portfolio entry. Try again.',
        });
        return;
      }
      setPortfolio((current) =>
        editingIndex === null
          ? [...current, entry]
          : current.map((item, index) => (index === editingIndex ? entry : item)),
      );
      startNewPortfolioEntry();
      setPortfolioStatus({ tone: 'success', message: 'Portfolio saved locally.' });
    } finally {
      setPortfolioSaving(false);
    }
  }

  async function deletePortfolioEntry(index: number) {
    if (portfolioSaving) return;
    setPortfolioSaving(true);
    try {
      if (!(await removePortfolio(index))) {
        setPortfolioStatus({
          tone: 'error',
          message: 'Local storage could not remove this portfolio entry. Try again.',
        });
        return;
      }
      setPortfolio((current) => current.filter((_, position) => position !== index));
      if (editingIndex === index) {
        startNewPortfolioEntry();
      } else {
        const adjustedIndex = adjustEditingIndex(editingIndex, index);
        if (adjustedIndex !== editingIndex) setEditingIndex(adjustedIndex);
      }
      setPortfolioStatus({ tone: 'success', message: 'Portfolio entry removed locally.' });
    } finally {
      setPortfolioSaving(false);
    }
  }

  const profileDisabled = loading || loadFailed || profileSaving;
  const portfolioDisabled = loading || loadFailed || portfolioSaving;
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
      </div>
    </main>
  );
}

export { OptionsApp };
export default OptionsApp;
