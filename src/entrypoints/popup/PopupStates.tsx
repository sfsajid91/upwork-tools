import type { ThemeMode } from '../../lib/theme';
import { ThemeToggle } from './PopupComponents';
import { AlertTriangleIcon, RadarIcon, ShieldCheckIcon } from './PopupIcons';

export function EmptyState({
  title,
  copy,
  tone = 'default',
  themeMode,
  onToggleTheme,
  onRetry,
}: {
  title: string;
  copy: string;
  tone?: 'default' | 'error';
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
  onRetry?: () => void;
}) {
  return (
    <section className="flex min-h-[460px] flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-6 text-center shadow-xs dark:border-slate-800/90 dark:bg-slate-900">
      {themeMode && onToggleTheme && (
        <div className="mb-4 flex w-full justify-end">
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>
      )}

      <div
        className={`mb-4 flex size-12 items-center justify-center rounded-2xl shadow-inner ${
          tone === 'error'
            ? 'border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
            : 'border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
        }`}
        aria-hidden="true"
      >
        {tone === 'error' ? (
          <AlertTriangleIcon className="size-6" />
        ) : (
          <RadarIcon className="size-6" />
        )}
      </div>

      <h1 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <p
        className="mb-6 max-w-[32ch] text-xs leading-relaxed text-slate-500 dark:text-slate-400"
        role="status"
        aria-live="polite"
      >
        {copy}
      </p>

      {onRetry && (
        <button
          type="button"
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:outline-slate-100"
          onClick={onRetry}
        >
          Retry
        </button>
      )}

      {tone === 'default' && (
        <div className="mt-6 w-full rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-left dark:border-slate-800 dark:bg-slate-800/60">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            How it works
          </div>
          <ol className="m-0 list-decimal space-y-1.5 pl-4 text-xs text-slate-600 dark:text-slate-300">
            <li>Open any job post on Upwork.</li>
            <li>Let the page finish loading its details.</li>
            <li>Open this popup for instant authenticated signals.</li>
          </ol>
        </div>
      )}

      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <ShieldCheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>100% Local session data · No duplicate requests</span>
      </div>
    </section>
  );
}

export function LoadingState({
  themeMode,
  onToggleTheme,
}: {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  return (
    <section
      className="flex min-h-[460px] flex-col rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800/90 dark:bg-slate-900"
      aria-busy="true"
      aria-label="Loading job insights"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
          {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
          <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <div className="mb-1.5 h-6 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mb-4 h-3.5 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

      {/* Hero Skeleton */}
      <div className="mb-3 rounded-2xl bg-slate-900 p-4 ring-1 ring-white/10 dark:bg-slate-950 dark:ring-slate-800">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-700 dark:bg-slate-800" />
          <div className="h-4 w-28 animate-pulse rounded-full bg-slate-800 dark:bg-slate-800" />
        </div>
        <div className="my-3 h-10 w-20 animate-pulse rounded bg-slate-700 dark:bg-slate-800" />
        <div className="border-t border-slate-800 pt-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="h-6 animate-pulse rounded bg-slate-800" />
            <div className="h-6 animate-pulse rounded bg-slate-800" />
            <div className="h-6 animate-pulse rounded bg-slate-800" />
            <div className="h-6 animate-pulse rounded bg-slate-800" />
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
      </div>
    </section>
  );
}
