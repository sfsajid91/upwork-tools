import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { splitList } from './App';
import { SettingsCard, SettingsStatusAlert, type Status } from './SettingsComponents';
import { PlusIcon, SparklesIcon, UserIcon } from './SettingsIcons';

const SUGGESTED_SKILLS = [
  'TypeScript',
  'React',
  'Node.js',
  'Next.js',
  'GraphQL',
  'Tailwind CSS',
  'Python',
  'PostgreSQL',
  'APIs',
] as const;

const RATE_PRESETS = ['50', '75', '100', '125', '150'] as const;

export interface ProfileSectionProps {
  skills: string;
  setSkills: (skills: string) => void;
  fallbackRate: string;
  setFallbackRate: (rate: string) => void;
  profileDisabled: boolean;
  saveProfile: (event: FormEvent<HTMLFormElement>) => void;
  profileStatus: Status;
}

export function ProfileSection({
  skills,
  setSkills,
  fallbackRate,
  setFallbackRate,
  profileDisabled,
  saveProfile,
  profileStatus,
}: ProfileSectionProps) {
  const parsedSkills = splitList(skills);

  function handleAddSkillPreset(skillName: string) {
    if (parsedSkills.includes(skillName)) return;
    const separator = skills.trim().length === 0 ? '' : ', ';
    setSkills(`${skills.trim()}${separator}${skillName}`);
  }

  function handleRemoveSkill(skillToRemove: string) {
    const updated = parsedSkills.filter((item) => item !== skillToRemove);
    setSkills(updated.join(', '));
  }

  return (
    <SettingsCard
      id="profile"
      headingId="profile-heading"
      title="Your profile"
      description="Captured job rates remain primary; this rate is only a local fallback when none is posted."
      icon={UserIcon}
    >
      <form className="space-y-5" onSubmit={saveProfile}>
        {/* Skills Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="profile-skills">Skills</Label>
            <span className="text-xs text-muted-foreground">
              {parsedSkills.length} {parsedSkills.length === 1 ? 'skill' : 'skills'} configured
            </span>
          </div>
          <Textarea
            id="profile-skills"
            className="min-h-24"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="TypeScript, React, Node.js, GraphQL, APIs"
            aria-describedby="skills-help"
            disabled={profileDisabled}
          />
          <p id="skills-help" className="text-muted-foreground text-xs">
            Separate skills with commas or new lines.
          </p>

          {/* Live parsed badges */}
          {parsedSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                Parsed:
              </span>
              {parsedSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  <span>{skill}</span>
                  {!profileDisabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={`Remove skill ${skill}`}
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}

          {/* Skill Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <SparklesIcon className="size-3 text-primary" />
              <span className="text-xs">Suggestions:</span>
            </div>
            {SUGGESTED_SKILLS.map((item) => {
              const isAdded = parsedSkills.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAddSkillPreset(item)}
                  disabled={profileDisabled || isAdded}
                  className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition-all sm:px-2 sm:py-0.5 ${
                    isAdded
                      ? 'border-transparent bg-muted/60 text-muted-foreground/60 cursor-default'
                      : 'border-border/80 bg-background text-foreground/80 hover:border-primary/50 hover:bg-primary/5 hover:text-primary cursor-pointer'
                  }`}
                >
                  {!isAdded && <PlusIcon className="size-2.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fallback Hourly Rate */}
        <div className="space-y-2">
          <Label htmlFor="fallback-rate">Fallback hourly rate (USD)</Label>
          <div className="flex max-w-xs items-center gap-2">
            <span className="font-semibold text-muted-foreground text-sm">$</span>
            <Input
              id="fallback-rate"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={fallbackRate}
              onChange={(event) => setFallbackRate(event.target.value)}
              placeholder="e.g. 75.00 (leave blank for no fallback)"
              aria-describedby="rate-help"
              disabled={profileDisabled}
            />
          </div>
          <p id="rate-help" className="text-muted-foreground text-xs">
            Leave blank if you prefer job fit calculations without an assumed minimum rate.
          </p>

          {/* Rate Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground">Quick set:</span>
            {RATE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setFallbackRate(preset)}
                disabled={profileDisabled}
                className="cursor-pointer rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs text-foreground/80 transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary sm:px-2 sm:py-0.5"
              >
                ${preset}/hr
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" size="default" disabled={profileDisabled}>
            Save profile
          </Button>
        </div>
        <SettingsStatusAlert status={profileStatus} />
      </form>
    </SettingsCard>
  );
}
