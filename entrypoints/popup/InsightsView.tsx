import type { ReactNode } from 'react';
import {
  formatApplicationState,
  formatDate,
  formatJobStatus,
  formatMoney,
  formatNumber,
  formatPercent,
  formatRateContext,
  formatRating,
  formatRelativeTime,
} from '../../lib/format';
import type { ClientHistoryEntry, JobInsights, JobWarning } from '../../lib/insights';

const WARNING_COPY: Record<JobWarning, string> = {
  'position-filled': 'Position already filled',
  'already-hired': 'Client already hired for this job',
  'already-applied': 'Already applied',
  'client-invited': 'Client invited you',
};

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="grid min-w-0 gap-1">
      <span className="text-[10px] leading-tight text-[#718096]">{label}</span>
      <strong
        className={`break-words text-[13px] font-bold leading-tight tabular-nums ${
          accent ? 'text-[#087f5b]' : 'text-[#26364d]'
        }`}
      >
        {value}
      </strong>
    </div>
  );
}

function WarningStrip({ insights }: { insights: JobInsights }) {
  const messages = [
    ...insights.warnings.map((warning) => WARNING_COPY[warning]),
    ...insights.job.restrictions.map((restriction) => `Restriction: ${restriction}`),
  ];
  if (messages.length === 0) return null;

  return (
    <aside
      className="mb-3 rounded-[13px] border border-[#f1d28b] bg-[#fff6df] px-[13px] py-3 text-[#6e4c08]"
      aria-label="Important warnings"
      role="alert"
    >
      <strong className="mb-1 block text-[11px] tracking-[0.02em]">Pay attention</strong>
      <ul className="m-0 grid list-none gap-[3px] p-0">
        {messages.map((message) => (
          <li
            className="text-[11px] leading-[1.35] before:mr-[6px] before:content-['•']"
            key={message}
          >
            {message}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function HistoryRow({ job }: { job: ClientHistoryEntry }) {
  const details = [
    job.type,
    job.amountPaid === null ? null : formatMoney(job.amountPaid, 'USD'),
    job.feedbackScore === null ? null : `${formatRating(job.feedbackScore)} review`,
  ].filter(Boolean);

  return (
    <li className="grid gap-[3px] py-3 first:pt-0 last:pb-0 [&+li]:border-t [&+li]:border-[#e7edf4]">
      <strong className="text-[12px] leading-[1.35] text-[#26364d]">
        {job.title ?? 'Untitled job'}
      </strong>
      <span className="text-[10px] leading-[1.35] text-[#718096]">
        {details.join(' · ') || 'Details not available'}
      </span>
      <span className="text-[10px] leading-[1.35] text-[#718096]">
        {job.status?.toLowerCase() ?? 'Status not available'}
      </span>
    </li>
  );
}

function HistoryDetails({ title, jobs }: { title: string; jobs: ClientHistoryEntry[] }) {
  if (jobs.length === 0) return null;

  return (
    <details className="mb-3 overflow-hidden rounded-[14px] border border-[#dfe7f0] bg-white shadow-[0_7px_18px_rgba(29,41,57,0.05)]">
      <summary className="flex cursor-pointer list-none items-center justify-between px-[15px] py-3.5 text-[13px] font-bold text-[#172033] marker:hidden focus-visible:outline-2 focus-visible:outline-[#62cda0] focus-visible:outline-offset-2">
        <span>{title}</span>
        <span className="ml-auto mr-2.5 rounded-full bg-[#d9f4e8] px-[7px] py-[5px] text-[10px] font-extrabold leading-none text-[#087f5b]">
          {jobs.length}
        </span>
      </summary>
      <div className="border-t border-[#e7edf4] px-[15px] py-3">
        <ul className="m-0 list-none p-0" aria-label={title}>
          {jobs.map((job) => (
            <HistoryRow
              key={[job.id, job.title, job.startedOn, job.amountPaid, title]
                .filter(Boolean)
                .join('-')}
              job={job}
            />
          ))}
        </ul>
      </div>
    </details>
  );
}

export function EmptyState({
  title,
  copy,
  tone = 'default',
}: {
  title: string;
  copy: string;
  tone?: 'default' | 'error';
}) {
  return (
    <section className="flex min-h-[300px] flex-col items-start rounded-2xl border border-[#dfe7f0] bg-white p-[22px] shadow-[0_9px_22px_rgba(29,41,57,0.06)]">
      <span
        className={`mb-6 inline-flex size-[34px] items-center justify-center rounded-[10px] text-[18px] font-extrabold ${
          tone === 'error' ? 'bg-[#ffebd6] text-[#9b4d16]' : 'bg-[#d9f4e8] text-[#087f5b]'
        }`}
        aria-hidden="true"
      >
        {tone === 'error' ? '!' : '—'}
      </span>
      <h1 className="mb-[9px] text-[24px] font-bold leading-[1.1] tracking-[-0.03em] text-[#172033]">
        {title}
      </h1>
      <p className="m-0 max-w-[34ch] text-[13px] leading-[1.55] text-[#66758a]">{copy}</p>
    </section>
  );
}

export function LoadingState() {
  return (
    <section
      className="flex min-h-[300px] flex-col items-start rounded-2xl border border-[#dfe7f0] bg-white p-[22px] shadow-[0_9px_22px_rgba(29,41,57,0.06)]"
      aria-busy="true"
      aria-label="Loading job insights"
    >
      <div className="mb-[17px] h-[10px] w-[88px] animate-pulse rounded-[7px] bg-[#e5ebf3]" />
      <div className="mb-[10px] h-7 w-[84%] animate-pulse rounded-[7px] bg-[#e5ebf3]" />
      <div className="mb-7 h-3 w-[62%] animate-pulse rounded-[7px] bg-[#e5ebf3]" />
      <div className="mt-auto w-full rounded-[14px] bg-[#152d4f] p-[17px]">
        <div className="h-[10px] w-24 animate-pulse rounded-[7px] bg-[#355273]" />
        <div className="mt-[18px] h-[42px] w-[100px] animate-pulse rounded-[7px] bg-[#355273]" />
      </div>
    </section>
  );
}

export function AvailableState({ insights }: { insights: JobInsights }) {
  const { job, activity, client, fit, history } = insights;
  const location = [client.city, client.country].filter(Boolean).join(', ') || 'Not available';
  const qualificationCount =
    fit.qualificationsMatched === null || fit.qualificationsTotal === null
      ? 'Not available'
      : `${fit.qualificationsMatched}/${fit.qualificationsTotal}`;
  const paymentStatus =
    client.paymentVerified === null
      ? 'Not available'
      : client.paymentVerified
        ? 'Verified'
        : 'Not verified';
  const ratingSummary =
    client.rating === null && client.feedbackCount === null
      ? 'Not available'
      : `${formatRating(client.rating)} · ${formatNumber(client.feedbackCount)}`;
  const interviewSummary =
    activity.interviewRate === null
      ? 'Interview rate not available'
      : `${formatPercent(activity.interviewRate)} interviewed`;
  const statusChipClass =
    job.status?.toUpperCase() === 'FILLED'
      ? 'bg-[#ffebd6] text-[#9b4d16]'
      : job.status
        ? 'bg-[#d9f4e8] text-[#087f5b]'
        : 'bg-[#e5ebf3] text-[#526173]';

  return (
    <>
      <header className="mb-4 mt-0.5 px-px">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold tracking-[0.1em] text-[#526173]">
            UPWORK TOOLS
          </span>
          <span
            className={`inline-flex rounded-full px-[9px] py-[7px] text-[10px] font-extrabold leading-none ${statusChipClass}`}
          >
            {formatJobStatus(job.status)}
          </span>
        </div>
        <h1 className="mb-[7px] mt-[11px] text-[23px] font-bold leading-[1.12] tracking-[-0.025em] text-[#172033]">
          {job.title ?? 'Untitled job'}
        </h1>
        <p className="m-0 text-xs leading-[1.5] text-[#66758a]">
          {[job.type, job.contractorTier, job.category].filter(Boolean).join(' · ') || 'Upwork job'}
        </p>
      </header>

      <WarningStrip insights={insights} />

      <section
        className="mb-3 rounded-[15px] bg-[#152d4f] p-[17px] text-white shadow-[0_10px_24px_rgba(21,45,79,0.18)]"
        aria-labelledby="proposal-heading"
      >
        <div className="flex items-center justify-between">
          <h2 id="proposal-heading" className="text-sm font-bold leading-tight tracking-[-0.01em]">
            Exact Proposals
          </h2>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#b6c7dd]">
            Authenticated response
          </span>
        </div>
        <strong className="my-[18px] block text-[49px] font-bold leading-[0.96] tracking-[-0.06em] tabular-nums">
          {formatNumber(activity.exactProposals)}
        </strong>
        <div className="flex flex-wrap gap-x-3 gap-y-[7px] border-t border-white/25 pt-[11px] text-[11px] text-[#d7e1ee]">
          <span>{formatNumber(activity.interviewed)} interviewed</span>
          <span>{formatNumber(activity.totalHired)} hired</span>
          <span>{formatNumber(activity.positionsToHire)} position</span>
        </div>
      </section>

      <section
        className="mb-3 rounded-[14px] border border-[#dfe7f0] bg-white p-[15px] shadow-[0_7px_18px_rgba(29,41,57,0.05)]"
        aria-labelledby="competition-heading"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <h2
            id="competition-heading"
            className="text-sm font-bold leading-tight tracking-[-0.01em] text-[#172033]"
          >
            Competition
          </h2>
          <span className="text-[10px] text-[#718096]">{interviewSummary}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
          <Metric label="Interview rate" value={formatPercent(activity.interviewRate)} accent />
          <Metric
            label="Last buyer activity"
            value={formatRelativeTime(activity.lastBuyerActivity)}
          />
        </div>
      </section>

      <section
        className="mb-3 rounded-[14px] border border-[#dfe7f0] bg-white p-[15px] shadow-[0_7px_18px_rgba(29,41,57,0.05)]"
        aria-labelledby="client-heading"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <h2
            id="client-heading"
            className="text-sm font-bold leading-tight tracking-[-0.01em] text-[#172033]"
          >
            Client
          </h2>
          <span className="text-[10px] text-[#718096]">
            {client.topClient === true ? 'Top client' : ''}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
          <Metric label="Payment" value={paymentStatus} accent={client.paymentVerified === true} />
          <Metric label="Rating · reviews" value={ratingSummary} />
          <Metric label="Total spend" value={formatMoney(client.totalCharges, 'USD')} accent />
          <Metric label="Historical hire rate" value={formatPercent(client.hireRate)} accent />
          <Metric label="Jobs posted" value={formatNumber(client.jobsPosted)} />
          <Metric label="Jobs with hires" value={formatNumber(client.totalJobsWithHires)} />
          <Metric
            label="Average hourly rate"
            value={formatMoney(client.averageHourlyRate, 'USD')}
          />
          <Metric label="Member since" value={formatDate(client.memberSince)} />
          <Metric label="Location" value={location} />
        </div>
      </section>

      <section
        className="mb-3 rounded-[14px] border border-[#dfe7f0] bg-white p-[15px] shadow-[0_7px_18px_rgba(29,41,57,0.05)]"
        aria-labelledby="fit-heading"
      >
        <div className="mb-3.5 flex items-center justify-between">
          <h2
            id="fit-heading"
            className="text-sm font-bold leading-tight tracking-[-0.01em] text-[#172033]"
          >
            Your fit
          </h2>
          {fit.applicationState && (
            <span className="text-[10px] text-[#718096]">
              {formatApplicationState(fit.applicationState)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
          <Metric label="Requirements matched" value={qualificationCount} accent />
          <Metric label="Your hourly rate" value={formatMoney(fit.freelancerHourlyRate, 'USD')} />
          <Metric label="Client average" value={formatMoney(client.averageHourlyRate, 'USD')} />
          <Metric label="Rate context" value={formatRateContext(fit.rateContext)} />
        </div>
      </section>

      <HistoryDetails title="Client history" jobs={history.recentJobs} />
      <HistoryDetails title="Related jobs" jobs={history.relatedJobs} />

      <footer className="flex justify-between gap-3 px-0.5 pb-1 pt-px text-[10px] text-[#718096]">
        <span>Posted {formatDate(job.postedOn)}</span>
        <span className="text-right">
          {job.budgetAmount === null
            ? 'Budget not provided'
            : formatMoney(job.budgetAmount, job.budgetCurrency)}
        </span>
      </footer>
    </>
  );
}
