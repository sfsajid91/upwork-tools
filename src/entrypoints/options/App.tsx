import { type FormEvent, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { clearAllLocalData } from '../../lib/database';
import { createPortfolio, removePortfolio, updatePortfolio } from '../../lib/portfolio';
import { isPortfolioEntry, isUserProfile, setUserProfile } from '../../lib/settings';
import { listWatchlistedJobs, removeWatchlistedJob } from '../../lib/watchlist';
import { useTheme } from '../../lib/theme';
import type { PortfolioEntry, UserProfile, WatchlistRecord } from '../../lib/storage';
import { OptionsContent } from './OptionsContent';

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
  useTheme();
  const [skills, setSkills] = useState('');
  const [fallbackRate, setFallbackRate] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    hourlyRate: null,
    skills: [],
    preferences: {},
  });
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistRecord[]>([]);
  const [portfolioDraft, setPortfolioDraft] = useState<PortfolioDraft>(EMPTY_DRAFT);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [profileStatus, setProfileStatus] = useState<Status>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [portfolioStatus, setPortfolioStatus] = useState<Status>(null);
  const [portfolioSaving, setPortfolioSaving] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState<Status>(null);
  const [watchlistRemoving, setWatchlistRemoving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clearStatus, setClearStatus] = useState<Status>(null);
  const [clearPending, setClearPending] = useState(false);

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
        setWatchlist(await listWatchlistedJobs());
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

  async function removeWatchlistJob(jobId: string) {
    if (watchlistRemoving) return;
    setWatchlistRemoving(true);
    setWatchlistStatus(null);
    try {
      if (!(await removeWatchlistedJob(jobId))) {
        setWatchlistStatus({
          tone: 'error',
          message: 'Local storage could not remove this saved job. Try again.',
        });
        return;
      }
      setWatchlist((current) => current.filter((entry) => entry.jobId !== jobId));
      setWatchlistStatus({ tone: 'success', message: 'Saved job removed locally.' });
    } catch {
      setWatchlistStatus({
        tone: 'error',
        message: 'Local storage could not remove this saved job. Try again.',
      });
    } finally {
      setWatchlistRemoving(false);
    }
  }
  async function clearLocalData() {
    if (clearPending || loading || loadFailed) return;
    if (
      !window.confirm(
        'Clear local history, jobs, applications, and watchlist? Your profile, portfolio, and settings will be preserved.',
      )
    ) {
      return;
    }

    setClearPending(true);
    setClearStatus(null);
    try {
      const cleared = await clearAllLocalData();
      if (cleared) setWatchlist([]);
      setClearStatus(
        cleared
          ? { tone: 'success', message: 'Local history and job data cleared.' }
          : { tone: 'error', message: 'Local data could not be cleared. Try again.' },
      );
    } catch {
      setClearStatus({ tone: 'error', message: 'Local data could not be cleared. Try again.' });
    } finally {
      setClearPending(false);
    }
  }
  const clearDataDisabled = loading || loadFailed || clearPending;

  const profileDisabled = loading || loadFailed || profileSaving;
  const portfolioDisabled = loading || loadFailed || portfolioSaving;
  const watchlistDisabled = loading || loadFailed || watchlistRemoving;
  return (
    <OptionsContent
      skills={skills}
      setSkills={setSkills}
      fallbackRate={fallbackRate}
      setFallbackRate={setFallbackRate}
      profileDisabled={profileDisabled}
      saveProfile={saveProfile}
      profileStatus={profileStatus}
      portfolio={portfolio}
      portfolioDisabled={portfolioDisabled}
      startNewPortfolioEntry={startNewPortfolioEntry}
      editPortfolioEntry={editPortfolioEntry}
      deletePortfolioEntry={deletePortfolioEntry}
      portfolioDraft={portfolioDraft}
      setPortfolioDraft={setPortfolioDraft}
      editingIndex={editingIndex}
      savePortfolioEntry={savePortfolioEntry}
      portfolioStatus={portfolioStatus}
      watchlist={watchlist}
      watchlistDisabled={watchlistDisabled}
      removeWatchlistJob={removeWatchlistJob}
      watchlistStatus={watchlistStatus}
      clearDataDisabled={clearDataDisabled}
      clearLocalData={clearLocalData}
      clearPending={clearPending}
      clearStatus={clearStatus}
    />
  );
}

export { OptionsApp };
export default OptionsApp;
