import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { PortfolioEntry, WatchlistRecord } from '../../lib/storage';
import type { ThemeMode } from '../../lib/theme';
import { splitList } from './App';
import { DataSection } from './DataSection';
import { PortfolioDraftForm, PortfolioItemCard, type PortfolioDraft } from './PortfolioComponents';
import { ProfileSection } from './ProfileSection';
import {
  SettingsCard,
  SettingsHeader,
  SettingsNav,
  SettingsOverview,
  type Status,
} from './SettingsComponents';
import { BriefcaseIcon, PlusIcon } from './SettingsIcons';
import { WatchlistSection } from './WatchlistSection';

export interface SettingsContentProps {
  skills: string;
  setSkills: (skills: string) => void;
  fallbackRate: string;
  setFallbackRate: (rate: string) => void;
  profileDisabled: boolean;
  saveProfile: (event: FormEvent<HTMLFormElement>) => void;
  profileStatus: Status;
  portfolio: PortfolioEntry[];
  portfolioDisabled: boolean;
  startNewPortfolioEntry: () => void;
  editPortfolioEntry: (index: number) => void;
  deletePortfolioEntry: (index: number) => void | Promise<void>;
  portfolioDraft: PortfolioDraft;
  setPortfolioDraft: (draft: PortfolioDraft) => void;
  editingIndex: number | null;
  savePortfolioEntry: (event: FormEvent<HTMLFormElement>) => void;
  portfolioStatus: Status;
  watchlist: WatchlistRecord[];
  watchlistDisabled: boolean;
  removeWatchlistJob: (jobId: string) => void | Promise<void>;
  watchlistStatus: Status;
  clearDataDisabled: boolean;
  clearLocalData: (skipConfirm?: boolean) => void | Promise<void>;
  clearPending: boolean;
  clearStatus: Status;
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}

export function SettingsContent({
  skills,
  setSkills,
  fallbackRate,
  setFallbackRate,
  profileDisabled,
  saveProfile,
  profileStatus,
  portfolio,
  portfolioDisabled,
  startNewPortfolioEntry,
  editPortfolioEntry,
  deletePortfolioEntry,
  portfolioDraft,
  setPortfolioDraft,
  editingIndex,
  savePortfolioEntry,
  portfolioStatus,
  watchlist,
  watchlistDisabled,
  removeWatchlistJob,
  watchlistStatus,
  clearDataDisabled,
  clearLocalData,
  clearPending,
  clearStatus,
  themeMode,
  onToggleTheme,
}: SettingsContentProps) {
  const parsedSkills = splitList(skills);

  return (
    <TooltipProvider delay={200}>
      <main className="min-h-screen bg-background px-4 py-8 text-foreground antialiased sm:px-8 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <SettingsHeader themeMode={themeMode} onToggleTheme={onToggleTheme} />

          <SettingsOverview
            skillsCount={parsedSkills.length}
            hourlyRate={fallbackRate}
            portfolioCount={portfolio.length}
            watchlistCount={watchlist.length}
          />

          <SettingsNav />

          {/* Profile Section */}
          <ProfileSection
            skills={skills}
            setSkills={setSkills}
            fallbackRate={fallbackRate}
            setFallbackRate={setFallbackRate}
            profileDisabled={profileDisabled}
            saveProfile={saveProfile}
            profileStatus={profileStatus}
          />

          {/* Portfolio Section */}
          <SettingsCard
            id="portfolio"
            headingId="portfolio-heading"
            title="Portfolio"
            description="Entries stay local. URLs are stored as text and never opened or fetched in the background."
            icon={BriefcaseIcon}
            badge={
              portfolio.length > 0 ? <Badge variant="secondary">{portfolio.length}</Badge> : null
            }
            actions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startNewPortfolioEntry}
                disabled={portfolioDisabled}
              >
                Add entry
              </Button>
            }
          >
            {portfolio.length > 0 ? (
              <ul className="space-y-3" aria-label="Saved portfolio entries">
                {portfolio.map((entry, index) => (
                  <PortfolioItemCard
                    key={`${entry.title}:${entry.url ?? ''}:${entry.skills.join(',')}:${entry.tags.join(',')}`}
                    entry={entry}
                    index={index}
                    isEditing={editingIndex === index}
                    disabled={portfolioDisabled}
                    onEdit={editPortfolioEntry}
                    onDelete={deletePortfolioEntry}
                  />
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-border/80 border-dashed p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground/70">
                  <BriefcaseIcon className="size-6" />
                </div>
                <p className="mt-3 font-semibold text-foreground text-sm">
                  No portfolio entries yet
                </p>
                <p className="mx-auto mt-1 max-w-sm text-muted-foreground text-xs leading-relaxed">
                  Add your projects below to enable smart portfolio match suggestions in job
                  details.
                </p>
                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startNewPortfolioEntry}
                    disabled={portfolioDisabled}
                  >
                    <PlusIcon className="size-3" />
                    <span>Add your first project</span>
                  </Button>
                </div>
              </div>
            )}

            {portfolio.length > 0 && <Separator className="my-6" />}

            {/* Portfolio Entry Form */}
            <PortfolioDraftForm
              draft={portfolioDraft}
              onChangeDraft={setPortfolioDraft}
              editingIndex={editingIndex}
              disabled={portfolioDisabled}
              onSubmit={savePortfolioEntry}
              onCancel={startNewPortfolioEntry}
              status={portfolioStatus}
            />
          </SettingsCard>

          {/* Watchlist Section */}
          <WatchlistSection
            watchlist={watchlist}
            watchlistDisabled={watchlistDisabled}
            removeWatchlistJob={removeWatchlistJob}
            watchlistStatus={watchlistStatus}
          />

          {/* Clear Local Data Section */}
          <DataSection
            clearDataDisabled={clearDataDisabled}
            clearLocalData={clearLocalData}
            clearPending={clearPending}
            clearStatus={clearStatus}
          />
        </div>
      </main>
    </TooltipProvider>
  );
}
