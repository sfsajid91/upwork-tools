import { afterEach, describe, expect, test } from 'bun:test';
import {
  createPortfolio,
  listPortfolio,
  removePortfolio,
  updatePortfolio,
} from './portfolio';

function installStorage(initial: Record<string, unknown> = {}) {
  const root = globalThis as typeof globalThis & { browser?: unknown };
  const previous = root.browser;
  const values = { ...initial };
  root.browser = {
    storage: {
      local: {
        async get(key: string) {
          return { [key]: values[key] };
        },
        async set(items: Record<string, unknown>) {
          Object.assign(values, items);
        },
      },
    },
  };
  return { values, restore: () => (previous === undefined ? delete root.browser : (root.browser = previous)) };
}

afterEach(() => {
  delete (globalThis as typeof globalThis & { browser?: unknown }).browser;
});

describe('portfolio facade', () => {
  test('performs typed CRUD using local storage and never opens URLs', async () => {
    const fixture = installStorage();
    const first = { title: 'Extension', skills: ['TypeScript'], tags: ['browser'], url: 'https://example.test/project' };
    const second = { title: 'API', skills: ['Cloudflare'], tags: ['workers'], url: null };
    try {
      expect(await createPortfolio(first)).toBe(true);
      expect(await createPortfolio(second)).toBe(true);
      expect(await listPortfolio()).toEqual([first, second]);
      expect(await updatePortfolio(0, { ...first, title: 'Updated' })).toBe(true);
      expect(await removePortfolio(1)).toBe(true);
      expect(await listPortfolio()).toEqual([{ ...first, title: 'Updated' }]);
    } finally {
      fixture.restore();
    }
  });

  test('rejects invalid entries and indices without changing storage', async () => {
    const fixture = installStorage();
    try {
      expect(await createPortfolio({ title: 'Bad', skills: [], tags: [], url: 42 as never })).toBe(false);
      expect(await updatePortfolio(0, { title: 'Missing', skills: [], tags: [], url: null })).toBe(false);
      expect(await removePortfolio(-1)).toBe(false);
      expect(fixture.values.portfolio).toBeUndefined();
    } finally {
      fixture.restore();
    }
  });

  test('returns empty list when storage is unavailable', async () => {
    expect(await listPortfolio()).toEqual([]);
    expect(await createPortfolio({ title: 'Project', skills: [], tags: [], url: null })).toBe(false);
  });
});
