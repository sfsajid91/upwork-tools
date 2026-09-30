import { Button } from '@/components/ui/button';
import type { ThemeMode } from '../../lib/theme';
import { ThemeToggle } from './PopupComponents';
import { SettingsIcon } from './PopupIcons';

export function TopNav({
  themeMode,
  onToggleTheme,
}: {
  themeMode?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  return (
    <header className="mb-2.5 flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-[11px] font-bold tracking-wider uppercase text-foreground/80">
          Upwork Tools
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {themeMode && onToggleTheme && <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />}
        <Button
          type="button"
          variant="outline"
          size="xs"
          className="rounded-full gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => void browser.runtime.openOptionsPage()}
          aria-label="Settings"
          title="Settings"
        >
          <SettingsIcon className="size-3" />
          <span>Settings</span>
        </Button>
      </div>
    </header>
  );
}
