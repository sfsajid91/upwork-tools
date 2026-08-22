import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatPercent,
  formatRelativeTime,
} from '../../lib/format';
import type { JobInsights } from '../../lib/insights';
import { isJobInsights } from '../../lib/insights';
import { GET_JOB_INSIGHTS } from '../../lib/protocol';

type ViewState =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; insights: JobInsights };
function Metric({
  label,
  value,
  prominent = false,
}: {
  label: string;
  value: string;
  prominent?: boolean;
}) {
  return (
    <div className="grid min-w-0 gap-1">
      <span className="text-[11px] text-[#718096]">{label}</span>
      <strong
        className={
          prominent
            ? 'break-words text-sm font-semibold text-[#087f5b]'
            : 'break-words text-sm font-semibold text-[#26364d]'
        }
      >
        {value}
      </strong>
    </div>
  );
}

function AvailableState({ insights }: { insights: JobInsights }) {
  const { job, activity, client } = insights;
  return (
    <>
      <header className="mb-4">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#526173]">
          Job Insights
        </p>
        <h1 className="mb-2 text-[22px] font-semibold leading-tight text-[#172033]">
          {job.title ?? 'Untitled job'}
        </h1>
        <p className="mb-0 text-xs leading-5 text-[#66758a]">
          {[job.type, job.contractorTier, job.category].filter(Boolean).join(' · ') || 'Upwork job'}
        </p>
      </header>

      <section
        className="mb-3.5 rounded-[14px] border border-[#e2e8f0] bg-[#152d4f] p-[18px] text-white shadow-[0_8px_24px_rgba(29,41,57,0.06)]"
        aria-labelledby="proposal-heading"
      >
        <p
          id="proposal-heading"
          className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#b6c7dd]"
        >
          Exact Proposals
        </p>
        <strong className="mb-1 block text-[42px] font-bold leading-none">
          {formatNumber(activity.exactProposals)}
        </strong>
        <p className="mb-0 text-xs leading-5 text-[#b6c7dd]">
          Applicants reported by the authenticated job response
        </p>
      </section>

      <section
        className="mb-3.5 rounded-[14px] border border-[#e2e8f0] bg-white p-4 shadow-[0_8px_24px_rgba(29,41,57,0.06)]"
        aria-labelledby="activity-heading"
      >
        <h2 className="mb-3.5 text-sm font-semibold text-[#172033]" id="activity-heading">
          Activity
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
          <Metric label="Hired" value={formatNumber(activity.totalHired)} prominent />
          <Metric label="Interview invites" value={formatNumber(activity.invitedToInterview)} />
          <Metric label="Positions" value={formatNumber(activity.positionsToHire)} />
          <Metric
            label="Last buyer activity"
            value={formatRelativeTime(activity.lastBuyerActivity)}
          />
        </div>
      </section>

      <section
        className="mb-3.5 rounded-[14px] border border-[#e2e8f0] bg-white p-4 shadow-[0_8px_24px_rgba(29,41,57,0.06)]"
        aria-labelledby="client-heading"
      >
        <h2 className="mb-3.5 text-sm font-semibold text-[#172033]" id="client-heading">
          Client
        </h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
          <Metric label="Hire rate" value={formatPercent(client.hireRate)} prominent />
          <Metric
            label="Rating"
            value={client.rating === null ? 'Not available' : client.rating.toFixed(2)}
          />
          <Metric label="Jobs posted" value={formatNumber(client.jobsPosted)} />
          <Metric
            label="Payment verified"
            value={
              client.paymentVerified === null
                ? 'Not available'
                : client.paymentVerified
                  ? 'Yes'
                  : 'No'
            }
          />
          <Metric
            label="Location"
            value={[client.city, client.country].filter(Boolean).join(', ') || 'Not available'}
          />
          <Metric label="Total charges" value={formatMoney(client.totalCharges, 'USD')} />
        </div>
      </section>

      <footer className="flex justify-between gap-3 px-0.5 pt-0.5 text-[11px] text-[#718096]">
        <span>Posted {formatDate(job.postedOn)}</span>
        <span>
          {job.budgetAmount === null
            ? 'Budget not provided'
            : formatMoney(job.budgetAmount, job.budgetCurrency)}
        </span>
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
        const insights = await browser.runtime.sendMessage({
          type: GET_JOB_INSIGHTS,
          tabId: tab.id,
        });
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
    <main className="min-h-[520px] w-full p-5">
      {state.kind === 'loading' && (
        <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_24px_rgba(29,41,57,0.06)]">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#526173]">
            Upwork Tools
          </p>
          <h1 className="text-[22px] font-semibold leading-tight text-[#172033]">
            Loading insights…
          </h1>
        </div>
      )}
      {state.kind === 'empty' && (
        <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_24px_rgba(29,41,57,0.06)]">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#526173]">
            Upwork Tools
          </p>
          <h1 className="mb-2 text-[22px] font-semibold leading-tight text-[#172033]">
            No job insights yet
          </h1>
          <p className="mb-0 text-xs leading-5 text-[#66758a]">
            Open an Upwork job and let its details load, then reopen this popup.
          </p>
        </div>
      )}
      {state.kind === 'error' && (
        <div className="rounded-[14px] border border-[#e2e8f0] bg-white p-6 shadow-[0_8px_24px_rgba(29,41,57,0.06)]">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#526173]">
            Upwork Tools
          </p>
          <h1 className="mb-2 text-[22px] font-semibold leading-tight text-[#172033]">
            Something went wrong
          </h1>
          <p className="mb-0 text-xs leading-5 text-[#66758a]">{state.message}</p>
        </div>
      )}
      {state.kind === 'ready' && <AvailableState insights={state.insights} />}
    </main>
  );
}

export default App;
