import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { SettingsCard, SettingsStatusAlert, type Status } from './SettingsComponents';
import { DatabaseIcon, TrashIcon } from './SettingsIcons';

export interface DataSectionProps {
  clearDataDisabled: boolean;
  clearLocalData: (skipConfirm?: boolean) => void | Promise<void>;
  clearPending: boolean;
  clearStatus: Status;
}

export function DataSection({
  clearDataDisabled,
  clearLocalData,
  clearPending,
  clearStatus,
}: DataSectionProps) {
  return (
    <SettingsCard
      id="data"
      headingId="clear-data-heading"
      title="Clear local data"
      description="Remove local history, jobs, applications, and watchlist data. Your profile, portfolio, and settings are preserved."
      icon={DatabaseIcon}
      variant="danger"
    >
      <div className="space-y-4">
        {/* Detailed Breakdown Card */}
        <div className="grid gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-xs sm:grid-cols-2">
          <div className="space-y-1">
            <p className="font-semibold text-destructive">Wiped from local storage:</p>
            <ul className="list-inside list-disc space-y-0.5 text-destructive/90">
              <li>Cached job snapshots & competition metrics</li>
              <li>Historical application logs & tracking</li>
              <li>Watchlist saved opportunities</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground/90">Preserved on this device:</p>
            <ul className="list-inside list-disc space-y-0.5 text-muted-foreground">
              <li>User profile skills & fallback hourly rate</li>
              <li>Portfolio projects, tags, & links</li>
              <li>Theme preference (Dark / Light / System)</li>
            </ul>
          </div>
        </div>

        {/* AlertDialog Confirmation */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="default"
                  disabled={clearDataDisabled}
                  aria-describedby="clear-data-help"
                  aria-busy={clearPending}
                />
              }
            >
              <TrashIcon className="size-4" />
              <span>{clearPending ? 'Clearing local data…' : 'Clear local data'}</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <TrashIcon className="size-5" />
                </div>
                <AlertDialogTitle>Clear local history and cache?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all captured job snapshots, applicant metrics, and
                  watchlisted jobs from your browser’s IndexedDB. Your profile skills, fallback
                  rate, and portfolio entries will be safely preserved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => void clearLocalData(true)}>
                  Yes, clear local data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p id="clear-data-help" className="text-muted-foreground text-xs leading-relaxed">
          This operation directly purges extension database stores and cannot be undone.
        </p>

        <SettingsStatusAlert status={clearStatus} />
      </div>
    </SettingsCard>
  );
}
