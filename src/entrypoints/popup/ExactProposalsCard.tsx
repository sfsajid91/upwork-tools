import { formatNumber, formatPercent, formatRelativeTime } from '../../lib/format';
import type { JobInsights } from '../../lib/insights';
import { ClockIcon, LockIcon } from './PopupIcons';

export function ExactProposalsCard({
  activity,
  viewerMode,
}: {
  activity: JobInsights['activity'];
  viewerMode: JobInsights['viewerMode'];
}) {
  return (
    <section
      className="relative overflow-hidden rounded-xl bg-slate-900 p-3.5 text-white shadow-sm ring-1 ring-white/10 dark:bg-slate-950 dark:ring-slate-800"
      aria-labelledby="hero-proposals-heading"
    >
      <div className="flex items-center justify-between">
        <h2
          id="hero-proposals-heading"
          className="text-[11px] font-bold tracking-wider uppercase text-slate-300"
        >
          Exact Proposals
        </h2>
        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          <LockIcon className="size-2.5" />
          <span>{viewerMode === 'visitor' ? 'Public snapshot' : 'Authenticated'}</span>
        </div>
      </div>

      <div className="my-2.5 flex items-baseline justify-between">
        <div className="text-4xl font-extrabold tracking-tight tabular-nums text-white">
          {formatNumber(activity.exactProposals)}
        </div>
        {activity.interviewRate !== null && (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-right">
            <span className="block text-[10px] font-medium tracking-wider uppercase text-emerald-400/90">
              Interview Rate
            </span>
            <span className="text-sm font-bold tabular-nums text-emerald-300">
              {formatPercent(activity.interviewRate)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-slate-800/90 pt-2.5 text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-slate-400">Interviews</span>
          <span className="text-xs font-bold tabular-nums text-white">
            {formatNumber(activity.interviewed)}
          </span>
        </div>
        <div className="flex flex-col items-center border-x border-slate-800">
          <span className="text-[10px] font-medium text-slate-400">Hired</span>
          <span className="text-xs font-bold tabular-nums text-white">
            {formatNumber(activity.totalHired)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-slate-400">Positions</span>
          <span className="text-xs font-bold tabular-nums text-white">
            {formatNumber(activity.positionsToHire)}
          </span>
        </div>
      </div>

      {activity.lastBuyerActivity && (
        <div className="mt-2.5 flex items-center justify-center gap-1 text-[10.5px] text-slate-400">
          <ClockIcon className="size-3" />
          <span>Client active {formatRelativeTime(activity.lastBuyerActivity)}</span>
        </div>
      )}
    </section>
  );
}
