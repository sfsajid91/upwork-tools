import { browser as importedBrowser } from 'wxt/browser';
import { isPortfolioEntry, setPortfolio } from './settings';
import type { PortfolioEntry } from './storage';

type PortfolioInput = PortfolioEntry;
const PORTFOLIO_KEY = 'portfolio';

type LocalStorage = { get(key: string): Promise<Record<string, unknown>> };
type ExtensionApi = { storage?: { local?: LocalStorage } };

function storage(): LocalStorage | undefined {
  const browser = (globalThis as typeof globalThis & { browser?: ExtensionApi }).browser;
  return (browser ?? (importedBrowser as unknown as ExtensionApi | undefined))?.storage?.local;
}

async function readPortfolio(): Promise<{ ok: boolean; entries: PortfolioEntry[] | null }> {
  const area = storage();
  if (!area) return { ok: false, entries: null };
  try {
    const value = (await area.get(PORTFOLIO_KEY))[PORTFOLIO_KEY];
    if (value === undefined) return { ok: true, entries: [] };
    return {
      ok: true,
      entries: Array.isArray(value) && value.every(isPortfolioEntry) ? value : null,
    };
  } catch {
    return { ok: false, entries: null };
  }
}

function validUrl(url: string | null): boolean {
  if (url === null) return true;
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname.length > 0
    );
  } catch {
    return false;
  }
}

function validEntry(entry: PortfolioInput): boolean {
  return isPortfolioEntry(entry) && validUrl(entry.url);
}

function validIndex(index: unknown, length: number): index is number {
  return typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < length;
}

/** Lists locally stored portfolio entries; unavailable or invalid storage reads as empty. */
export async function listPortfolio(): Promise<PortfolioEntry[]> {
  const result = await readPortfolio();
  return result.ok && result.entries
    ? result.entries.map((entry) => ({
        ...entry,
        skills: [...entry.skills],
        tags: [...entry.tags],
      }))
    : [];
}

export async function createPortfolio(entry: PortfolioInput): Promise<boolean> {
  if (!validEntry(entry)) return false;
  const result = await readPortfolio();
  if (!result.ok || !result.entries) return false;
  return setPortfolio([...result.entries, entry]);
}

/** Replaces an entry by its stable zero-based list position. */
export async function updatePortfolio(index: number, entry: PortfolioInput): Promise<boolean> {
  if (!validEntry(entry)) return false;
  const result = await readPortfolio();
  if (!result.ok || !result.entries || !validIndex(index, result.entries.length)) return false;
  const updated = [...result.entries];
  updated[index] = entry;
  return setPortfolio(updated);
}

/** Removes an entry by its stable zero-based list position. */
export async function removePortfolio(index: number): Promise<boolean> {
  const result = await readPortfolio();
  if (!result.ok || !result.entries || !validIndex(index, result.entries.length)) return false;
  return setPortfolio(result.entries.filter((_, position) => position !== index));
}

export const listPortfolioEntries = listPortfolio;
export const createPortfolioEntry = createPortfolio;
export const updatePortfolioEntry = updatePortfolio;
export const removePortfolioEntry = removePortfolio;
