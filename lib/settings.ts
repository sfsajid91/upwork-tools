import { browser as importedBrowser } from 'wxt/browser';
import type { PortfolioEntry, ThemeMode, UiSettings, UserProfile } from './storage';

export const LEGACY_THEME_KEY = 'upwork-tools-theme';
export const UI_SETTINGS_KEY = 'uiSettings';
export const USER_PROFILE_KEY = 'userProfile';
export const PORTFOLIO_KEY = 'portfolio';
const THEME_FALLBACK_KEY = 'upwork-tools-theme-fallback';
interface StorageArea {
  get(key: string): Promise<Record<string, unknown>>;
  set(value: Record<string, unknown>): Promise<void>;
}

type ExtensionApi = { storage?: { local?: StorageArea } };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

export function isUserProfile(value: unknown): value is UserProfile {
  return (
    isRecord(value) &&
    (value.hourlyRate === null ||
      (typeof value.hourlyRate === 'number' && Number.isFinite(value.hourlyRate))) &&
    Array.isArray(value.skills) &&
    value.skills.every((skill) => typeof skill === 'string') &&
    isRecord(value.preferences)
  );
}

export function isPortfolioEntry(value: unknown): value is PortfolioEntry {
  return (
    isRecord(value) &&
    typeof value.title === 'string' &&
    Array.isArray(value.skills) &&
    value.skills.every((skill) => typeof skill === 'string') &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === 'string') &&
    (value.url === null || typeof value.url === 'string')
  );
}

export function isUiSettings(value: unknown): value is UiSettings {
  return (
    isRecord(value) &&
    isThemeMode(value.theme) &&
    isRecord(value.features) &&
    Object.values(value.features).every((enabled) => typeof enabled === 'boolean')
  );
}

function getStorageArea(): StorageArea | undefined {
  const globalBrowser = (globalThis as typeof globalThis & { browser?: ExtensionApi }).browser;
  const extensionBrowser =
    globalBrowser ?? (importedBrowser as unknown as ExtensionApi | undefined);
  return extensionBrowser?.storage?.local;
}

function readLocalTheme(key: string): ThemeMode | null {
  try {
    const value = globalThis.localStorage?.getItem(key);
    return isThemeMode(value) ? value : null;
  } catch {
    return null;
  }
}

function readLegacyTheme(): ThemeMode | null {
  return readLocalTheme(LEGACY_THEME_KEY);
}

function removeLegacyTheme(): void {
  try {
    globalThis.localStorage?.removeItem(LEGACY_THEME_KEY);
  } catch {
    // Ignore unavailable or restricted localStorage.
  }
}

function removeThemeFallback(): void {
  try {
    globalThis.localStorage?.removeItem(THEME_FALLBACK_KEY);
  } catch {
    // Ignore unavailable or restricted localStorage.
  }
}

function writeLegacyTheme(mode: ThemeMode): void {
  try {
    globalThis.localStorage?.setItem(LEGACY_THEME_KEY, mode);
  } catch {
    // Ignore unavailable or restricted localStorage.
  }
}

function writeThemeFallback(mode: ThemeMode): void {
  try {
    globalThis.localStorage?.setItem(THEME_FALLBACK_KEY, mode);
  } catch {
    // Ignore unavailable or restricted localStorage.
  }
}

interface StoredValueResult {
  ok: boolean;
  value: unknown;
}

async function readStoredValue(key: string): Promise<StoredValueResult> {
  const storage = getStorageArea();
  if (!storage) return { ok: false, value: undefined };
  try {
    const values = await storage.get(key);
    return { ok: true, value: values?.[key] };
  } catch {
    return { ok: false, value: undefined };
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const result = await readStoredValue(USER_PROFILE_KEY);
  return result.ok && isUserProfile(result.value) ? result.value : null;
}

export async function setUserProfile(profile: UserProfile): Promise<boolean> {
  if (!isUserProfile(profile)) return false;
  const storage = getStorageArea();
  if (!storage) return false;
  try {
    await storage.set({ [USER_PROFILE_KEY]: profile });
    return true;
  } catch {
    return false;
  }
}

export async function getPortfolio(): Promise<PortfolioEntry[] | null> {
  const result = await readStoredValue(PORTFOLIO_KEY);
  return result.ok &&
    Array.isArray(result.value) &&
    result.value.every((entry) => isPortfolioEntry(entry))
    ? result.value
    : null;
}

export async function setPortfolio(portfolio: PortfolioEntry[]): Promise<boolean> {
  if (!Array.isArray(portfolio) || !portfolio.every((entry) => isPortfolioEntry(entry)))
    return false;
  const storage = getStorageArea();
  if (!storage) return false;
  try {
    await storage.set({ [PORTFOLIO_KEY]: portfolio });
    return true;
  } catch {
    return false;
  }
}

export async function getUiSettings(): Promise<UiSettings | null> {
  const result = await readStoredValue(UI_SETTINGS_KEY);
  return result.ok && isUiSettings(result.value) ? result.value : null;
}

export async function setUiSettings(settings: UiSettings): Promise<boolean> {
  if (!isUiSettings(settings)) return false;
  const storage = getStorageArea();
  if (!storage) return false;
  try {
    await storage.set({ [UI_SETTINGS_KEY]: settings });
    return true;
  } catch {
    return false;
  }
}

let themeOperation: Promise<void> = Promise.resolve();

function enqueueThemeOperation<T>(operation: () => Promise<T>): Promise<T> {
  const result = themeOperation.then(
    () => operation(),
    () => operation(),
  );
  themeOperation = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

/** Resolve settings before the popup switches from the synchronous fallback. */
export function initializeTheme(): Promise<ThemeMode> {
  return enqueueThemeOperation(async () => {
    const storage = getStorageArea();
    const result = storage
      ? await readStoredValue(UI_SETTINGS_KEY)
      : { ok: false, value: undefined };
    const fallback = readLocalTheme(THEME_FALLBACK_KEY);
    if (fallback) {
      if (!storage || !result.ok) return fallback;
      const settings: UiSettings = isUiSettings(result.value)
        ? { ...result.value, theme: fallback }
        : { theme: fallback, features: {} };
      try {
        await storage.set({ [UI_SETTINGS_KEY]: settings });
      } catch {
        return fallback;
      }
      removeThemeFallback();
      removeLegacyTheme();
      return fallback;
    }
    if (result.ok && isRecord(result.value) && isThemeMode(result.value.theme)) {
      return result.value.theme;
    }

    const legacy = readLegacyTheme();
    if (!legacy || !storage || !result.ok) return legacy ?? 'system';
    const settings: UiSettings = isUiSettings(result.value)
      ? { ...result.value, theme: legacy }
      : { theme: legacy, features: {} };
    try {
      await storage.set({ [UI_SETTINGS_KEY]: settings });
    } catch {
      return legacy;
    }
    removeLegacyTheme();
    removeThemeFallback();
    return legacy;
  });
}

export function persistTheme(mode: ThemeMode): Promise<boolean> {
  if (!isThemeMode(mode)) return Promise.resolve(false);
  return enqueueThemeOperation(async () => {
    const storage = getStorageArea();
    if (!storage) {
      writeLegacyTheme(mode);
      writeThemeFallback(mode);
      return false;
    }
    const result = await readStoredValue(UI_SETTINGS_KEY);
    if (!result.ok) {
      writeLegacyTheme(mode);
      writeThemeFallback(mode);
      return false;
    }
    const settings: UiSettings = isUiSettings(result.value)
      ? { ...result.value, theme: mode }
      : { theme: mode, features: {} };
    try {
      await storage.set({ [UI_SETTINGS_KEY]: settings });
    } catch {
      writeLegacyTheme(mode);
      writeThemeFallback(mode);
      return false;
    }
    removeLegacyTheme();
    removeThemeFallback();
    return true;
  });
}

export function getLegacyTheme(): ThemeMode {
  return readLegacyTheme() ?? 'system';
}

export function setLegacyTheme(mode: ThemeMode): void {
  writeLegacyTheme(mode);
}
