import { describe, expect, test } from 'bun:test';
import { resolveIsDark } from './theme';

describe('theme resolution', () => {
  test('resolves explicit dark mode regardless of system setting', () => {
    expect(resolveIsDark('dark', false)).toBe(true);
    expect(resolveIsDark('dark', true)).toBe(true);
  });

  test('resolves explicit light mode regardless of system setting', () => {
    expect(resolveIsDark('light', false)).toBe(false);
    expect(resolveIsDark('light', true)).toBe(false);
  });

  test('resolves system mode using system preference', () => {
    expect(resolveIsDark('system', false)).toBe(false);
    expect(resolveIsDark('system', true)).toBe(true);
  });
});
