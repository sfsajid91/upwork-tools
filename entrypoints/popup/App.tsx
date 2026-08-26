import { useCallback, useEffect, useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import type { JobInsights } from '../../lib/insights';
import { isJobInsights } from '../../lib/insights';
import { normalizeJobId } from '../../lib/job-page';
import { rankPortfolioMatches } from '../../lib/portfolio-match';
import {
  GET_JOB_HISTORY,
  GET_JOB_INSIGHTS,
  isJobHistoryResponse,
  type JobHistoryResponse,
  type RuntimeMessage,
} from '../../lib/protocol';
import { getPortfolio, getUserProfile } from '../../lib/settings';
import { matchSkills } from '../../lib/skill-match';
import { useTheme } from '../../lib/theme';
import { bookmarkWatchlist, getWatchlistJob, removeWatchlist } from '../../lib/watchlist';
import {
  AvailableState,
  EmptyState,
  LoadingState,
  type PopupPersonalization,
  type WatchlistStatus,
} from './InsightsView';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | {
      kind: 'ready';
      insights: JobInsights;
      history: JobHistoryResponse | null;
      personalization: PopupPersonalization;
      historyFallback?: boolean;
      watchlistStatus: WatchlistStatus;
      watchlistBusy?: boolean;
    };

type PopupReadDependencies = {
  queryActiveTab: () => Promise<{ id?: number } | undefined>;
  sendMessage: (message: RuntimeMessage) => Promise<unknown>;
  onInsightsReady?: (state: Extract<ViewState, { kind: 'ready' }>) => void;
  onWatchlistReady?: (status: WatchlistStatus) => void;
};

const READ_ERROR_MESSAGE =
  'The extension could not read this tab. Reopen the popup after the job details finish loading.';
const EMPTY_PERSONALIZATION: PopupPersonalization = {
  fallbackHourlyRate: null,
  skillMatch: null,
  portfolioMatches: [],
};

export async function readPopupPersonalization(
  insights: JobInsights,
): Promise<PopupPersonalization> {
  try {
    const [profile, portfolio] = await Promise.all([getUserProfile(), getPortfolio()]);
    return {
      fallbackHourlyRate: profile?.hourlyRate ?? null,
      skillMatch: matchSkills({
        profileSkills: profile?.skills ?? null,
        ontologySkills: insights.job.skills,
        additionalSkills: [],
      }),
      portfolioMatches: rankPortfolioMatches(portfolio, {
        title: insights.job.title,
        skills: insights.job.skills,
      }),
    };
  } catch {
    return EMPTY_PERSONALIZATION;
  }
}
function normalizedJobId(insights: JobInsights): string | null {
  return normalizeJobId(insights.job.id);
}

export async function readWatchlistStatus(insights: JobInsights): Promise<WatchlistStatus> {
  const jobId = normalizedJobId(insights);
  if (!jobId) return { kind: 'unavailable', reason: 'missing-id' };
  try {
    return (await getWatchlistJob(jobId)) ? { kind: 'saved' } : { kind: 'not-saved' };
  } catch {
    return { kind: 'unavailable', reason: 'storage' };
  }
}

function readyWithWatchlist(
  result: Exclude<ViewState, { kind: 'loading' }>,
  watchlistStatus: WatchlistStatus,
): Exclude<ViewState, { kind: 'loading' }> {
  return result.kind === 'ready' ? { ...result, watchlistStatus } : result;
}

export async function readPopupInsights({
  queryActiveTab,
  sendMessage,
  onInsightsReady,
  onWatchlistReady,
}: PopupReadDependencies): Promise<Exclude<ViewState, { kind: 'loading' }>> {
  try {
    const tab = await queryActiveTab();
    if (tab?.id === undefined) throw new Error('No active tab');
    const insights = await sendMessage({ type: GET_JOB_INSIGHTS, tabId: tab.id });
    if (!isJobInsights(insights)) return { kind: 'empty' };

    const jobId = normalizedJobId(insights) ?? '';
    const personalization = await readPopupPersonalization(insights);
    const sessionReady = {
      kind: 'ready' as const,
      insights,
      history: null,
      personalization,
      watchlistStatus: { kind: 'unavailable' as const, reason: 'storage' as const },
    };
    onInsightsReady?.(sessionReady);
    const watchlistPromise = readWatchlistStatus(insights).then((status) => {
      onWatchlistReady?.(status);
      return status;
    });
    if (!jobId) {
      return readyWithWatchlist(sessionReady, await watchlistPromise);
    }

    try {
      const history = await sendMessage({ type: GET_JOB_HISTORY, tabId: tab.id, jobId });
      const validHistory = isJobHistoryResponse(history) && history.jobId === jobId;
      return readyWithWatchlist(
        {
          ...sessionReady,
          history: validHistory ? history : null,
          historyFallback: !validHistory,
        },
        await watchlistPromise,
      );
    } catch {
      return readyWithWatchlist({ ...sessionReady, historyFallback: true }, await watchlistPromise);
    }
  } catch {
    return { kind: 'error', message: READ_ERROR_MESSAGE };
  }
}

function App() {
  const { mode, cycleTheme } = useTheme();
  const [state, setState] = useState<ViewState>({ kind: 'loading' });
  const requestInFlight = useRef(false);

  const readInsights = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setState({ kind: 'loading' });

    try {
      const result = await readPopupInsights({
        queryActiveTab: async () => {
          const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
          return tab;
        },
        sendMessage: (message) => browser.runtime.sendMessage(message),
        onInsightsReady: setState,
        onWatchlistReady: (watchlistStatus) => {
          setState((current) =>
            current.kind === 'ready' ? { ...current, watchlistStatus } : current,
          );
        },
      });
      setState(result);
    } finally {
      requestInFlight.current = false;
    }
  }, []);

  const toggleWatchlist = useCallback(async () => {
    if (state.kind !== 'ready' || state.watchlistBusy) return;
    const jobId = normalizedJobId(state.insights);
    if (!jobId || state.watchlistStatus.kind === 'unavailable') return;
    const shouldRemove = state.watchlistStatus.kind === 'saved';
    setState((current) =>
      current.kind === 'ready' ? { ...current, watchlistBusy: true } : current,
    );
    try {
      const changed = shouldRemove
        ? await removeWatchlist(jobId)
        : await bookmarkWatchlist(state.insights);
      setState((current) =>
        current.kind === 'ready'
          ? {
              ...current,
              watchlistBusy: false,
              watchlistStatus: changed
                ? { kind: shouldRemove ? 'not-saved' : 'saved' }
                : { kind: 'unavailable', reason: 'storage' },
            }
          : current,
      );
    } catch {
      setState((current) =>
        current.kind === 'ready'
          ? {
              ...current,
              watchlistBusy: false,
              watchlistStatus: { kind: 'unavailable', reason: 'storage' },
            }
          : current,
      );
    }
  }, [state]);

  useEffect(() => {
    void readInsights();
  }, [readInsights]);

  return (
    <main className="min-h-[520px] w-full bg-slate-100/90 p-3.5 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {state.kind === 'loading' && <LoadingState themeMode={mode} onToggleTheme={cycleTheme} />}
      {state.kind === 'empty' && (
        <EmptyState
          title="No job insight yet"
          copy="Open an Upwork job and let its details load normally, then reopen this popup."
          themeMode={mode}
          onToggleTheme={cycleTheme}
          onRetry={readInsights}
        />
      )}
      {state.kind === 'error' && (
        <EmptyState
          title="Insights unavailable"
          copy={state.message}
          tone="error"
          themeMode={mode}
          onToggleTheme={cycleTheme}
          onRetry={readInsights}
        />
      )}
      {state.kind === 'ready' && (
        <AvailableState
          insights={state.insights}
          personalization={state.personalization}
          history={state.history}
          historyFallback={state.historyFallback}
          watchlistStatus={state.watchlistStatus}
          watchlistBusy={state.watchlistBusy}
          onToggleWatchlist={toggleWatchlist}
          themeMode={mode}
          onToggleTheme={cycleTheme}
        />
      )}
    </main>
  );
}

export default App;
