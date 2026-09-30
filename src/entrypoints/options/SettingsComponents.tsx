import { cn } from 'cn';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ThemeMode } from '../../lib/theme';
import {
  AlertCircleIcon,
  BookmarkIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  ShieldLockIcon,
  UserIcon,
} from './SettingsIcons';

export type Status = { tone: 'success' | 'error'; message: string } | null;

export function ThemeToggle({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const nextModeText =
    mode === 'dark' ? 'Switch to Light' : mode === 'light' ? 'Switch to System' : 'Switch to Dark';
  const label = `Theme: ${mode} (${nextModeText})`;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button type="button" variant="outline" size="sm" onClick={onToggle} aria-label={label} />
        }
      >
        {mode === 'dark' && <Moon className="size-3.5 text-primary" />}
        {mode === 'light' && <Sun className="size-3.5 text-warning" />}
        {mode === 'system' && <Monitor className="size-3.5 text-muted-foreground" />}
        <span className="capitalize">{mode}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function SettingsHeader({
  themeMode,
  onToggleTheme,
}: {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 border-border/80 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs ring-4 ring-ring/10">
          <ShieldLockIcon className="size-5.5" />
        </div>
        <div>
          <h1 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 max-w-2xl text-muted-foreground text-sm leading-relaxed">
            Personalize how Upwork Tools evaluates jobs. Your profile, rates, and saved work remain
            strictly on this device.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
        {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
        <Badge variant="outline">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span>Stored locally</span>
        </Badge>
      </div>
    </header>
  );
}

export function SettingsOverview({
  skillsCount,
  hourlyRate,
  portfolioCount,
  watchlistCount,
}: {
  skillsCount: number;
  hourlyRate: string;
  portfolioCount: number;
  watchlistCount: number;
}) {
  const rateDisplay = hourlyRate.trim() ? `$${hourlyRate}/hr fallback` : 'No fallback rate set';

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <a
        href="#profile"
        className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3.5 transition-all hover:border-border hover:bg-card hover:shadow-2xs"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <UserIcon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs">Profile</p>
          <p className="truncate text-muted-foreground text-xs">
            {skillsCount} {skillsCount === 1 ? 'skill' : 'skills'} · {rateDisplay}
          </p>
        </div>
      </a>

      <a
        href="#portfolio"
        className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3.5 transition-all hover:border-border hover:bg-card hover:shadow-2xs"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <BriefcaseIcon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs">Portfolio</p>
          <p className="truncate text-muted-foreground text-xs">
            {portfolioCount} {portfolioCount === 1 ? 'project' : 'projects'} saved
          </p>
        </div>
      </a>

      <a
        href="#watchlist"
        className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3.5 transition-all hover:border-border hover:bg-card hover:shadow-2xs"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
          <BookmarkIcon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs">Watchlist</p>
          <p className="truncate text-muted-foreground text-xs">
            {watchlistCount} {watchlistCount === 1 ? 'saved opportunity' : 'saved opportunities'}
          </p>
        </div>
      </a>
    </div>
  );
}

export function SettingsNav() {
  const links = [
    { href: '#profile', label: 'Profile', icon: UserIcon },
    { href: '#portfolio', label: 'Portfolio', icon: BriefcaseIcon },
    { href: '#watchlist', label: 'Watchlist', icon: BookmarkIcon },
    { href: '#data', label: 'Data', icon: DatabaseIcon },
  ] as const;

  return (
    <nav
      aria-label="Settings sections"
      className="sticky top-4 z-30 flex flex-wrap gap-1 rounded-xl border border-border/60 bg-card/85 p-1.5 shadow-xs backdrop-blur-md"
    >
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 font-medium text-muted-foreground text-xs transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:py-1.5 sm:text-sm"
        >
          <Icon className="size-3.5 text-muted-foreground transition-colors" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

export function SettingsCard({
  id,
  headingId,
  title,
  description,
  icon: Icon,
  badge,
  actions,
  children,
  variant = 'default',
}: {
  id: string;
  headingId: string;
  title: string;
  description: string;
  icon?: ({ className }: { className?: string }) => ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'danger';
}) {
  const isDanger = variant === 'danger';

  return (
    <Card id={id} aria-labelledby={headingId} className="scroll-mt-20">
      <CardHeader>
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className={cn(
                'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                isDanger ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
              )}
            >
              <Icon className="size-4" />
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2
                id={headingId}
                className="font-semibold text-base text-foreground tracking-tight sm:text-lg"
              >
                {title}
              </h2>
              {badge}
            </div>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {actions && <CardAction>{actions}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function SettingsStatusAlert({ status }: { status: Status }) {
  if (!status) return null;
  const isError = status.tone === 'error';

  return (
    <Alert
      role={isError ? 'alert' : 'status'}
      variant={isError ? 'destructive' : 'success'}
      className="mt-4"
    >
      {isError ? <AlertCircleIcon className="size-4" /> : <CheckCircle2Icon className="size-4" />}
      <AlertDescription>{status.message}</AlertDescription>
    </Alert>
  );
}
