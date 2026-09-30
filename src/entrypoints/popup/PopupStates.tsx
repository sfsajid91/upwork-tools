import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
    <section className="flex min-h-[460px] flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center shadow-xs text-card-foreground">
      {themeMode && onToggleTheme && (
        <div className="mb-4 flex w-full justify-end">
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
        </div>
      )}

      <div
        className={`mb-4 flex size-12 items-center justify-center rounded-2xl ${
          tone === 'error'
            ? 'border border-destructive/30 bg-destructive/10 text-destructive'
            : 'border border-primary/30 bg-primary/10 text-primary'
        }`}
        aria-hidden="true"
      >
        {tone === 'error' ? (
          <AlertTriangleIcon className="size-6" />
        ) : (
          <RadarIcon className="size-6" />
        )}
      </div>

      <h1 className="mb-1.5 text-base font-bold tracking-tight text-foreground">{title}</h1>
      <p
        className="mb-5 max-w-[32ch] text-xs leading-relaxed text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        {copy}
      </p>

      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}

      {tone === 'default' && (
        <div className="mt-6 w-full rounded-lg border border-border/50 bg-muted/40 p-3.5 text-left">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            How it works
          </div>
          <ol className="m-0 list-decimal space-y-1.5 pl-4 text-xs text-foreground/80">
            <li>Open any job post on Upwork.</li>
            <li>Let the page finish loading its details.</li>
            <li>Open this popup for instant authenticated signals.</li>
          </ol>
        </div>
      )}

      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
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
      className="flex min-h-[460px] flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs text-card-foreground"
      aria-busy="true"
      aria-label="Loading job insights"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 rounded" />
        <div className="flex items-center gap-2">
          {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-5 w-4/5 rounded" />
      <Skeleton className="h-3.5 w-1/2 rounded" />

      {/* Hero Skeleton */}
      <div className="rounded-xl bg-slate-900 p-3.5 ring-1 ring-white/10 dark:bg-slate-950 dark:ring-slate-800">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-24 bg-slate-800" />
          <Skeleton className="h-4 w-20 rounded-full bg-slate-800" />
        </div>
        <Skeleton className="my-3 h-9 w-24 bg-slate-800" />
        <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-2.5">
          <Skeleton className="h-6 bg-slate-800" />
          <Skeleton className="h-6 bg-slate-800" />
          <Skeleton className="h-6 bg-slate-800" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      </div>
    </section>
  );
}
