import { describe, expect, test } from 'bun:test';
import {
  getPortfolio,
  getUiSettings,
  getUserProfile,
  initializeTheme,
  persistTheme,
  setPortfolio,
  setUiSettings,
  setUserProfile,
} from './settings';

type Store = Record<string, unknown>;

function installStorage(initial: Store = {}) {
  const root = globalThis as typeof globalThis & {
    browser?: unknown;
    localStorage?: Storage;
  };
  const previousBrowser = root.browser;
  const previousLocalStorage = root.localStorage;
  const values = { ...initial };
  let failSet = false;
  let failGet = false;
  const legacy = new Map<string, string>();

  root.browser = {
    storage: {
      local: {
        async get(key: string) {
          if (failGet) throw new Error('storage unavailable');
          return { [key]: values[key] };
        },
        async set(items: Store) {
          if (failSet) throw new Error('storage unavailable');
          Object.assign(values, items);
        },
        async remove(key: string) {
          legacy.delete(key);
        },
      },
    },
  };
  root.localStorage = {
    getItem: (key) => legacy.get(key) ?? null,
    setItem: (key, value) => {
      legacy.set(key, value);
    },
    removeItem: (key) => {
      legacy.delete(key);
    },
    clear: () => legacy.clear(),
    key: (index) => [...legacy.keys()][index] ?? null,
    get length() {
      return legacy.size;
    },
  };

  return {
    values,
    legacy,
    failReads() {
      failGet = true;
    },
    failWrites() {
      failSet = true;
    },
    allowWrites() {
      failSet = false;
    },
    restore() {
      if (previousBrowser === undefined) Reflect.deleteProperty(root, 'browser');
      else root.browser = previousBrowser;
      if (previousLocalStorage === undefined) Reflect.deleteProperty(root, 'localStorage');
      else root.localStorage = previousLocalStorage;
    },
  };
}

describe('local settings adapter', () => {
  test('migrates every valid legacy theme mode', async () => {
    for (const mode of ['system', 'light', 'dark'] as const) {
      const fixture = installStorage();
      fixture.legacy.set('upwork-tools-theme', mode);
      try {
        expect(await initializeTheme()).toEqual(mode);
        expect(fixture.values.uiSettings).toEqual({ theme: mode, features: {} });
        expect(fixture.legacy.has('upwork-tools-theme')).toEqual(false);
      } finally {
        fixture.restore();
      }
    }
  });

  test('serializes initialization and user theme writes', async () => {
    const fixture = installStorage();
    fixture.legacy.set('upwork-tools-theme', 'dark');
    const root = globalThis as typeof globalThis & {
      browser?: { storage: { local: { get: (key: string) => Promise<Store> } } };
    };
    const local = root.browser?.storage.local;
    if (!local) throw new Error('test storage unavailable');
    const originalGet = local.get;
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    local.get = async (key: string) => {
      await blocked;
      return originalGet(key);
    };
    try {
      const initialization = initializeTheme();
      const persistence = persistTheme('light');
      release();
      expect(await initialization).toEqual('dark');
      expect(await persistence).toEqual(true);
      expect(fixture.values.uiSettings).toEqual({ theme: 'light', features: {} });
    } finally {
      fixture.restore();
    }
  });

  test('uses failed-write fallback over an older valid stored theme', async () => {
    const fixture = installStorage({ uiSettings: { theme: 'dark', features: { saved: true } } });
    try {
      fixture.failWrites();
      expect(await persistTheme('light')).toEqual(false);
      fixture.allowWrites();
      expect(await initializeTheme()).toEqual('light');
      expect(fixture.values.uiSettings).toEqual({ theme: 'light', features: { saved: true } });
      expect(fixture.legacy.has('upwork-tools-theme-fallback')).toEqual(false);
    } finally {
      fixture.restore();
    }
  });

  test('ignores malformed themes and keeps fallback when migration fails', async () => {
    const malformed = installStorage();
    malformed.legacy.set('upwork-tools-theme', 'sepia');
    try {
      expect(await initializeTheme()).toEqual('system');
      expect(malformed.values.uiSettings).toEqual(undefined);
    } finally {
      malformed.restore();
    }

    const failed = installStorage();
    failed.legacy.set('upwork-tools-theme', 'dark');
    failed.failWrites();
    try {
      expect(await initializeTheme()).toEqual('dark');
      expect(failed.legacy.get('upwork-tools-theme')).toEqual('dark');
    } finally {
      failed.restore();
    }
  });

  test('keeps settings intact and records fallback after a storage read failure', async () => {
    const fixture = installStorage({ uiSettings: { theme: 'light', features: { saved: true } } });
    fixture.legacy.set('upwork-tools-theme', 'dark');
    fixture.failReads();
    try {
      expect(await initializeTheme()).toEqual('dark');
      expect(fixture.values.uiSettings).toEqual({ theme: 'light', features: { saved: true } });
      expect(await persistTheme('system')).toEqual(false);
      expect(fixture.values.uiSettings).toEqual({ theme: 'light', features: { saved: true } });
      expect(fixture.legacy.get('upwork-tools-theme')).toEqual('system');
      expect(fixture.legacy.get('upwork-tools-theme-fallback')).toEqual('system');
    } finally {
      fixture.restore();
    }

    const invalid = installStorage({ uiSettings: { theme: 'light', features: { saved: true } } });
    try {
      expect(await persistTheme('invalid' as never)).toEqual(false);
      expect(invalid.values.uiSettings).toEqual({ theme: 'light', features: { saved: true } });
    } finally {
      invalid.restore();
    }
  });

  test('reads and writes validated profile, portfolio, and UI settings', async () => {
    const fixture = installStorage();
    try {
      const profile = { hourlyRate: 0, skills: ['TypeScript'], preferences: {} };
      const portfolio = [
        { title: 'Extension', skills: ['TypeScript'], tags: ['browser'], url: null },
      ];
      const settings = { theme: 'light' as const, features: { insights: true } };
      expect(await setUserProfile(profile)).toEqual(true);
      expect(await setPortfolio(portfolio)).toEqual(true);
      expect(await setUiSettings(settings)).toEqual(true);
      expect(await getUserProfile()).toEqual(profile);
      expect(await getPortfolio()).toEqual(portfolio);
      expect(await getUiSettings()).toEqual(settings);
      expect(await setUserProfile({ hourlyRate: Number.NaN, skills: [], preferences: {} })).toEqual(
        false,
      );
    } finally {
      fixture.restore();
    }
  });
});
