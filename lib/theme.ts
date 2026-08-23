import { useEffect, useRef, useState } from 'react';
import type { ThemeMode } from './storage';
import { getLegacyTheme, initializeTheme, persistTheme } from './settings';

export type { ThemeMode } from './storage';

export function getStoredTheme(): ThemeMode {
  return getLegacyTheme();
}

export function setStoredTheme(mode: ThemeMode): void {
  void persistTheme(mode);
}

export function resolveIsDark(mode: ThemeMode, systemPrefersDark: boolean): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return systemPrefersDark;
}

export function applyThemeClass(isDark: boolean): void {
  if (typeof document !== 'undefined') {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

export function useTheme(): {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  cycleTheme: () => void;
} {
  const [mode, setModeState] = useState<ThemeMode>(getStoredTheme);
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      setSystemDark(e.matches);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const initializationVersion = useRef(0);
  useEffect(() => {
    let cancelled = false;
    const version = initializationVersion.current;
    void initializeTheme().then((storedMode) => {
      if (!cancelled && initializationVersion.current === version) setModeState(storedMode);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const isDark = resolveIsDark(mode, systemDark);

  useEffect(() => {
    applyThemeClass(isDark);
  }, [isDark]);

  const setMode = (newMode: ThemeMode) => {
    initializationVersion.current += 1;
    setModeState(newMode);
    setStoredTheme(newMode);
  };

  const cycleTheme = () => {
    const next: Record<ThemeMode, ThemeMode> = {
      system: 'dark',
      dark: 'light',
      light: 'system',
    };
    setMode(next[mode]);
  };

  return { mode, isDark, setMode, cycleTheme };
}
