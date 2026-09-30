import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type { PortfolioEntry } from '../../lib/storage';
import type { ThemeMode } from '../../lib/theme';
import { ThemeToggle } from '../popup/PopupComponents';
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

export function SettingsHeader({
  themeMode,
  onToggleTheme,
}: {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/10 dark:bg-emerald-500 dark:ring-emerald-500/20">
          <ShieldLockIcon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Personalize how Upwork Tools evaluates jobs. Your profile, rates, and saved work remain
            strictly on this device.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
        {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
          <span
            className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
            aria-hidden="true"
          />
          Stored locally
        </div>
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
      className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200/70 bg-slate-200/40 p-1.5 backdrop-blur-xs dark:border-slate-800/70 dark:bg-slate-900/40"
    >
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className="inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-white hover:text-slate-900 hover:shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 focus-visible:outline-none dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:text-sm"
        >
          <Icon className="size-3.5 text-slate-500 dark:text-slate-400" />
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
  const borderStyles = isDanger
    ? 'border-rose-200/80 dark:border-rose-950/80 bg-white dark:bg-slate-900/90'
    : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90';

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`rounded-2xl border p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm sm:p-6 ${borderStyles}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                isDanger
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
              }`}
            >
              <Icon className="size-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2
                id={headingId}
                className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg"
              >
                {title}
              </h2>
              {badge}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SettingsStatusAlert({ status }: { status: Status }) {
  if (!status) return null;
  const isError = status.tone === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`mt-3 flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs font-medium ${
        isError
          ? 'border-rose-200 bg-rose-50/80 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200'
          : 'border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
      }`}
    >
      {isError ? (
        <AlertCircleIcon className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
      ) : (
        <CheckCircle2Icon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      )}
      <span className="leading-snug">{status.message}</span>
    </div>
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
      className={`flex flex-col justify-between gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-start ${
        isEditing
          ? 'border-emerald-500/80 bg-emerald-50/30 ring-1 ring-emerald-500/40 dark:border-emerald-500/60 dark:bg-emerald-950/20'
          : 'border-slate-200/80 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700'
      }`}
    >
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.title}</p>
          {isEditing && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Editing
            </span>
          )}
        </div>
        {combinedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {combinedTags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-slate-200/70 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 shadow-2xs dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500">No skills or tags listed</p>
        )}
        {entry.url && (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 underline decoration-emerald-300/80 underline-offset-2 hover:text-emerald-600 dark:text-emerald-400 dark:decoration-emerald-700"
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
          <PencilIcon className="size-3 text-slate-500 dark:text-slate-400" />
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
      className="mt-6 space-y-4 rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 dark:border-slate-800/80 dark:bg-slate-950/40 sm:p-5"
      onSubmit={onSubmit}
    >
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800/80">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {editingIndex === null ? 'Add portfolio entry' : 'Edit portfolio entry'}
        </h3>
        {editingIndex !== null && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Editing entry #{editingIndex + 1}
          </span>
        )}
      </div>

      <div>
        <label
          className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
          htmlFor="portfolio-title"
        >
          Title
        </label>
        <input
          id="portfolio-title"
          className="mt-1.5 block w-full rounded-xl border border-slate-300/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
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
            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
            htmlFor="portfolio-skills"
          >
            Skills
          </label>
          <input
            id="portfolio-skills"
            className="mt-1.5 block w-full rounded-xl border border-slate-300/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
            value={draft.skills}
            onChange={(event) => onChangeDraft({ ...draft, skills: event.target.value })}
            placeholder="React, TypeScript, Tailwind"
            disabled={disabled}
          />
        </div>

        <div>
          <label
            className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
            htmlFor="portfolio-tags"
          >
            Tags
          </label>
          <input
            id="portfolio-tags"
            className="mt-1.5 block w-full rounded-xl border border-slate-300/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
            value={draft.tags}
            onChange={(event) => onChangeDraft({ ...draft, tags: event.target.value })}
            placeholder="Dashboard, Full-stack, API"
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-300"
          htmlFor="portfolio-url"
        >
          URL <span className="font-normal text-slate-500 dark:text-slate-400">(optional)</span>
        </label>
        <input
          id="portfolio-url"
          className="mt-1.5 block w-full rounded-xl border border-slate-300/80 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:border-slate-700/80 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-emerald-400"
          type="url"
          inputMode="url"
          value={draft.url}
          onChange={(event) => onChangeDraft({ ...draft, url: event.target.value })}
          placeholder="https://example.com/project"
          aria-describedby="portfolio-url-help"
          disabled={disabled}
        />
        <p id="portfolio-url-help" className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
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
