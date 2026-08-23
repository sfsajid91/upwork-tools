import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import type { JobInsights } from '../../lib/insights';
import { isJobInsights } from '../../lib/insights';
import {
  GET_JOB_HISTORY,
  GET_JOB_INSIGHTS,
  isJobHistoryResponse,
  type JobHistoryResponse,
} from '../../lib/protocol';
import { useTheme } from '../../lib/theme';
import { AvailableState, EmptyState, LoadingState } from './InsightsView';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; insights: JobInsights; history: JobHistoryResponse | null };

function App() {
  const { mode, cycleTheme } = useTheme();
  const [state, setState] = useState<ViewState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function loadInsights() {
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab?.id === undefined) throw new Error('No active tab');
        const insights = await browser.runtime.sendMessage({
          type: GET_JOB_INSIGHTS,
          tabId: tab.id,
        });
        if (cancelled) return;
        if (!isJobInsights(insights)) {
          setState({ kind: 'empty' });
          return;
        }
        setState({ kind: 'ready', insights, history: null });
        const jobId = typeof insights.job.id === 'string' ? insights.job.id.trim() : '';
        if (!jobId) return;
        try {
          const history = await browser.runtime.sendMessage({
            type: GET_JOB_HISTORY,
            tabId: tab.id,
            jobId,
          });
          if (!cancelled && isJobHistoryResponse(history) && history.jobId === jobId) {
            setState({ kind: 'ready', insights, history });
          }
        } catch {
          // Historical storage is optional; the current snapshot remains available.
        }
      } catch {
        if (!cancelled) {
          setState({
            kind: 'error',
            message:
              'The extension could not read this tab. Reopen the popup after the job details finish loading.',
          });
        }
      }
    }

    void loadInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-[520px] w-full bg-slate-100/90 p-3.5 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {state.kind === 'loading' && <LoadingState themeMode={mode} onToggleTheme={cycleTheme} />}
      {state.kind === 'empty' && (
        <EmptyState
          title="No job insight yet"
          copy="Open an Upwork job and let its details load normally, then reopen this popup."
          themeMode={mode}
          onToggleTheme={cycleTheme}
        />
      )}
      {state.kind === 'error' && (
        <EmptyState
          title="Insights unavailable"
          copy={state.message}
          tone="error"
          themeMode={mode}
          onToggleTheme={cycleTheme}
        />
      )}
      {state.kind === 'ready' && (
        <AvailableState
          insights={state.insights}
          history={state.history}
          themeMode={mode}
          onToggleTheme={cycleTheme}
        />
      )}
    </main>
  );
}

export default App;
