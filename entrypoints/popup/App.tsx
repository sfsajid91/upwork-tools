import { useEffect, useState } from 'react';
import type { JobInsights } from '../../lib/insights';
import { isJobInsights } from '../../lib/insights';
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from '../../lib/format';
import { GET_JOB_INSIGHTS } from '../../lib/protocol';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; insights: JobInsights };

function Metric({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return (
    <div className={prominent ? 'metric metric-prominent' : 'metric'}>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function AvailableState({ insights }: { insights: JobInsights }) {
  const { job, activity, client } = insights;
  return (
    <>
      <header className="job-header">
        <p className="eyebrow">Job Insights</p>
        <h1>{job.title ?? 'Untitled job'}</h1>
        <p className="job-meta">
          {[job.type, job.contractorTier, job.category].filter(Boolean).join(' · ') || 'Upwork job'}
        </p>
      </header>

      <section className="proposal-card" aria-labelledby="proposal-heading">
        <p id="proposal-heading" className="eyebrow">Exact Proposals</p>
        <strong className="proposal-count">{formatNumber(activity.exactProposals)}</strong>
        <p className="muted">Applicants reported by the authenticated job response</p>
      </section>

      <section className="panel" aria-labelledby="activity-heading">
        <h2 id="activity-heading">Activity</h2>
        <div className="metrics-grid">
          <Metric label="Hired" value={formatNumber(activity.totalHired)} prominent />
          <Metric label="Interview invites" value={formatNumber(activity.invitedToInterview)} />
          <Metric label="Positions" value={formatNumber(activity.positionsToHire)} />
          <Metric label="Last buyer activity" value={formatRelativeTime(activity.lastBuyerActivity)} />
        </div>
      </section>

      <section className="panel" aria-labelledby="client-heading">
        <h2 id="client-heading">Client</h2>
        <div className="metrics-grid">
          <Metric label="Hire rate" value={formatPercent(client.hireRate)} prominent />
          <Metric label="Rating" value={client.rating === null ? 'Not available' : client.rating.toFixed(2)} />
          <Metric label="Jobs posted" value={formatNumber(client.jobsPosted)} />
          <Metric label="Payment verified" value={client.paymentVerified === null ? 'Not available' : client.paymentVerified ? 'Yes' : 'No'} />
          <Metric label="Location" value={[client.city, client.country].filter(Boolean).join(', ') || 'Not available'} />
          <Metric label="Total charges" value={formatMoney(client.totalCharges, 'USD')} />
        </div>
      </section>

      <footer className="job-footer">
        <span>Posted {formatDate(job.postedOn)}</span>
        <span>{job.budgetAmount === null ? 'Budget not provided' : formatMoney(job.budgetAmount, job.budgetCurrency)}</span>
      </footer>
    </>
  );
}

function App() {
  const [state, setState] = useState<ViewState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function loadInsights() {
      try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab?.id === undefined) throw new Error('No active tab');
        const insights = await browser.runtime.sendMessage({ type: GET_JOB_INSIGHTS, tabId: tab.id });
        if (cancelled) return;
        setState(isJobInsights(insights) ? { kind: 'ready', insights } : { kind: 'empty' });
      } catch {
        if (!cancelled) setState({ kind: 'error', message: 'Could not load job insights.' });
      }
    }

    void loadInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app-shell">
      {state.kind === 'loading' && <div className="state-card"><p className="eyebrow">Upwork Tools</p><h1>Loading insights…</h1></div>}
      {state.kind === 'empty' && <div className="state-card"><p className="eyebrow">Upwork Tools</p><h1>No job insights yet</h1><p className="muted">Open an Upwork job and let its details load, then reopen this popup.</p></div>}
      {state.kind === 'error' && <div className="state-card"><p className="eyebrow">Upwork Tools</p><h1>Something went wrong</h1><p className="muted">{state.message}</p></div>}
      {state.kind === 'ready' && <AvailableState insights={state.insights} />}
    </main>
  );
}

export default App;
