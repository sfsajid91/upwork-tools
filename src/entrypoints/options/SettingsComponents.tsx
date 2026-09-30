import { cn } from 'cn';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { PortfolioEntry } from '../../lib/storage';
import type { ThemeMode } from '../../lib/theme';
import {
  AlertCircleIcon,
  BookmarkIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  ExternalLinkIcon,
  PencilIcon,
  ShieldLockIcon,
  TrashIcon,
  UserIcon,
} from './SettingsIcons';

export type Status = { tone: 'success' | 'error'; message: string } | null;
export type PortfolioDraft = { title: string; skills: string; tags: string; url: string };

export function ThemeToggle({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const label =
    mode === 'dark'
      ? 'Theme: Dark (switch to Light)'
      : mode === 'light'
        ? 'Theme: Light (switch to System)'
        : 'Theme: System (switch to Dark)';

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onToggle}
      aria-label={label}
      title={label}
    >
      {mode === 'dark' && <Moon className="size-3.5 text-primary" />}
      {mode === 'light' && <Sun className="size-3.5 text-warning" />}
      {mode === 'system' && <Monitor className="size-3.5 text-muted-foreground" />}
      <span className="capitalize">{mode}</span>
    </Button>
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
    <header className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs ring-4 ring-ring/10">
          <ShieldLockIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Personalize how Upwork Tools evaluates jobs. Your profile, rates, and saved work remain
            strictly on this device.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
        {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
        <Badge variant="outline">
          <span className="mr-1 size-1.5 rounded-full bg-primary" aria-hidden="true" />
          Stored locally
        </Badge>
      </div>
    </header>
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
      className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-muted/60 p-1 backdrop-blur-xs"
    >
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-card hover:text-foreground hover:shadow-2xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm"
        >
          <Icon className="size-3.5 text-muted-foreground" />
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
    <Card id={id} aria-labelledby={headingId}>
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
                className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
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

export function PortfolioItemCard({
  entry,
  index,
  isEditing,
  disabled,
  onEdit,
  onDelete,
}: {
  entry: PortfolioEntry;
  index: number;
  isEditing: boolean;
  disabled: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void | Promise<void>;
}) {
  const combinedTags = [...entry.skills, ...entry.tags];

  return (
    <li
      className={cn(
        'flex flex-col justify-between gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-start',
        isEditing
          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
          : 'border-border/70 bg-card hover:border-border hover:bg-muted/40',
      )}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{entry.title}</p>
          {isEditing && <Badge variant="default">Editing</Badge>}
        </div>
        {combinedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {combinedTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No skills or tags listed</p>
        )}
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
          >
            <span className="max-w-md truncate">{entry.url}</span>
            <ExternalLinkIcon className="size-3 shrink-0" />
          </a>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => onEdit(index)}
          disabled={disabled}
        >
          <PencilIcon className="size-3 text-muted-foreground" />
          <span>Edit</span>
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="xs"
          onClick={() => void onDelete(index)}
          disabled={disabled}
        >
          <TrashIcon className="size-3" />
          <span>Remove</span>
        </Button>
      </div>
    </li>
  );
}

export function PortfolioDraftForm({
  draft,
  onChangeDraft,
  editingIndex,
  disabled,
  onSubmit,
  onCancel,
  status,
}: {
  draft: PortfolioDraft;
  onChangeDraft: (draft: PortfolioDraft) => void;
  editingIndex: number | null;
  disabled: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  status: Status;
}) {
  return (
    <form
      className="mt-6 space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4 sm:p-5"
      onSubmit={onSubmit}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="text-sm font-semibold text-foreground">
          {editingIndex === null ? 'Add portfolio entry' : 'Edit portfolio entry'}
        </h3>
        {editingIndex !== null && (
          <Badge variant="outline">Editing entry #{editingIndex + 1}</Badge>
        )}
      </div>

      <div>
        <label
          className="block text-xs font-semibold tracking-wide text-foreground/80 uppercase"
          htmlFor="portfolio-title"
        >
          Title
        </label>
        <Input
          id="portfolio-title"
          className="mt-1.5"
          value={draft.title}
          onChange={(event) => onChangeDraft({ ...draft, title: event.target.value })}
          placeholder="e.g. Next.js SaaS Analytics Platform"
          required
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="block text-xs font-semibold tracking-wide text-foreground/80 uppercase"
            htmlFor="portfolio-skills"
          >
            Skills
          </label>
          <Input
            id="portfolio-skills"
            className="mt-1.5"
            value={draft.skills}
            onChange={(event) => onChangeDraft({ ...draft, skills: event.target.value })}
            placeholder="React, TypeScript, Tailwind"
            disabled={disabled}
          />
        </div>

        <div>
          <label
            className="block text-xs font-semibold tracking-wide text-foreground/80 uppercase"
            htmlFor="portfolio-tags"
          >
            Tags
          </label>
          <Input
            id="portfolio-tags"
            className="mt-1.5"
            value={draft.tags}
            onChange={(event) => onChangeDraft({ ...draft, tags: event.target.value })}
            placeholder="Dashboard, Full-stack, API"
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold tracking-wide text-foreground/80 uppercase"
          htmlFor="portfolio-url"
        >
          URL <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Input
          id="portfolio-url"
          className="mt-1.5"
          type="url"
          inputMode="url"
          value={draft.url}
          onChange={(event) => onChangeDraft({ ...draft, url: event.target.value })}
          placeholder="https://example.com/project"
          aria-describedby="portfolio-url-help"
          disabled={disabled}
        />
        <p id="portfolio-url-help" className="mt-1.5 text-xs text-muted-foreground">
          Only http:// or https:// URLs are accepted.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <Button type="submit" size="default" disabled={disabled}>
          {editingIndex === null ? 'Add portfolio entry' : 'Save changes'}
        </Button>
        {editingIndex !== null && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </Button>
        )}
      </div>
      <SettingsStatusAlert status={status} />
    </form>
  );
}
