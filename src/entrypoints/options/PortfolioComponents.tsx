import { cn } from 'cn';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PortfolioEntry } from '../../lib/storage';
import { isHttpPortfolioUrl, splitList } from './App';
import { SettingsStatusAlert, type Status } from './SettingsComponents';
import {
  BriefcaseIcon,
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  SparklesIcon,
  TrashIcon,
  XIcon,
} from './SettingsIcons';

export type PortfolioDraft = { title: string; skills: string; tags: string; url: string };

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
  return (
    <li
      className={cn(
        'group flex flex-col justify-between gap-3.5 rounded-xl border p-4 transition-all sm:flex-row sm:items-start',
        isEditing
          ? 'border-primary/60 bg-primary/5 shadow-xs ring-2 ring-primary/20'
          : 'border-border/70 bg-card hover:border-border hover:shadow-2xs',
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <BriefcaseIcon className="size-3" />
            </span>
            <p className="font-semibold text-foreground text-sm tracking-tight">{entry.title}</p>
          </div>
          {isEditing && (
            <Badge variant="default">
              <PencilIcon className="size-2.5" />
              <span>Editing</span>
            </Badge>
          )}
        </div>

        {/* Skills and Tags Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {entry.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
          {entry.skills.length === 0 && entry.tags.length === 0 && (
            <span className="text-muted-foreground text-xs italic">No skills or tags added</span>
          )}
        </div>

        {/* Project Link */}
        {entry.url && (
          <div className="pt-1">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-primary text-xs underline underline-offset-2 transition-colors hover:text-primary/80"
            >
              <span className="truncate">{entry.url}</span>
              <ExternalLinkIcon className="size-3 shrink-0" />
            </a>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex min-h-[44px] shrink-0 items-center gap-1.5 self-end sm:min-h-0 sm:self-start">
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
  const isEditing = editingIndex !== null;
  const parsedSkills = splitList(draft.skills);
  const parsedTags = splitList(draft.tags);
  const trimmedUrl = draft.url.trim();
  const isUrlValid = isHttpPortfolioUrl(trimmedUrl || null);
  const hasPreviewContent =
    draft.title.trim().length > 0 || parsedSkills.length > 0 || parsedTags.length > 0;

  return (
    <form
      className="mt-6 space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4 sm:p-5"
      onSubmit={onSubmit}
    >
      <div className="flex items-center justify-between border-border/60 border-b pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {isEditing ? <PencilIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              {isEditing ? 'Edit portfolio entry' : 'Add portfolio entry'}
            </h3>
            <p className="text-muted-foreground text-xs">
              {isEditing
                ? 'Update this project’s metadata and skills'
                : 'Project details used for local skill and portfolio matching'}
            </p>
          </div>
        </div>
        {isEditing && <Badge variant="outline">Entry #{editingIndex + 1}</Badge>}
      </div>

      {/* Project Title */}
      <div className="space-y-1.5">
        <Label htmlFor="portfolio-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="portfolio-title"
          value={draft.title}
          onChange={(event) => onChangeDraft({ ...draft, title: event.target.value })}
          placeholder="e.g. Next.js SaaS Analytics Platform"
          required
          disabled={disabled}
        />
      </div>

      {/* Skills & Tags Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="portfolio-skills">Skills</Label>
          <Input
            id="portfolio-skills"
            value={draft.skills}
            onChange={(event) => onChangeDraft({ ...draft, skills: event.target.value })}
            placeholder="React, TypeScript, Tailwind"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated skills matched against job requirements.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="portfolio-tags">Tags</Label>
          <Input
            id="portfolio-tags"
            value={draft.tags}
            onChange={(event) => onChangeDraft({ ...draft, tags: event.target.value })}
            placeholder="Dashboard, Full-stack, API"
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            Project domains, architectures, or industries.
          </p>
        </div>
      </div>

      {/* Project URL */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="portfolio-url">
            URL <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          {trimmedUrl.length > 0 && (
            <span
              className={cn(
                'text-xs',
                isUrlValid ? 'text-primary' : 'text-destructive font-medium',
              )}
            >
              {isUrlValid ? '✓ Valid format' : 'Must start with http:// or https://'}
            </span>
          )}
        </div>
        <Input
          id="portfolio-url"
          type="url"
          inputMode="url"
          value={draft.url}
          onChange={(event) => onChangeDraft({ ...draft, url: event.target.value })}
          placeholder="https://example.com/project"
          aria-describedby="portfolio-url-help"
          disabled={disabled}
          aria-invalid={!isUrlValid && trimmedUrl.length > 0}
        />
        <p id="portfolio-url-help" className="text-xs text-muted-foreground">
          Only http:// or https:// URLs are accepted. Links are stored locally and never fetched.
        </p>
      </div>

      {/* Live Preview Card */}
      {hasPreviewContent && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <SparklesIcon className="size-3 text-primary" />
            <span className="font-medium text-xs uppercase tracking-wider">Live Preview</span>
          </div>
          <div className="rounded-lg border border-dashed border-border/80 bg-background/50 p-3.5">
            <p className="font-semibold text-foreground text-sm">
              {draft.title.trim() || 'Untitled project'}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {parsedSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {parsedTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
            {trimmedUrl && (
              <p className="mt-1.5 truncate text-xs text-primary underline underline-offset-2">
                {trimmedUrl}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2">
        <Button type="submit" size="default" disabled={disabled}>
          {isEditing ? <SaveIcon className="size-3.5" /> : <PlusIcon className="size-3.5" />}
          <span>{isEditing ? 'Save changes' : 'Add portfolio entry'}</span>
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onCancel}
            disabled={disabled}
          >
            <XIcon className="size-3.5" />
            <span>Cancel</span>
          </Button>
        )}
      </div>

      <SettingsStatusAlert status={status} />
    </form>
  );
}
