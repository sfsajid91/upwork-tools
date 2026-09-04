import { describe, expect, test } from 'bun:test';
import {
  formatMoney,
  formatNumber,
  formatPercent,
  formatRateContext,
  formatRating,
  formatRelativeCaptureTime,
  formatTrackingSpan,
} from '../../src/lib/format';

describe('format', () => {
  test('formats finite numbers and money normally', () => {
    expect(formatNumber(42)).toBe('42');
    expect(formatPercent(12.34)).toBe('12.3%');
    expect(formatRating(4.5)).toBe('4.50');
    expect(formatRateContext(1.26)).toBe('~1.3× client average');
    expect(formatMoney(100, 'USD')).toBe('$100.00');
    expect(formatMoney(5, null)).toBe('$5.00');
  });

  test('reports non-finite numbers as not available instead of NaN or Infinity', () => {
    expect(formatNumber(Number.NaN)).toBe('Not available');
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('Not available');
    expect(formatPercent(Number.NaN)).toBe('Not available');
    expect(formatPercent(Number.NEGATIVE_INFINITY)).toBe('Not available');
    expect(formatRating(Number.NaN)).toBe('Not available');
    expect(formatRating(Number.POSITIVE_INFINITY)).toBe('Not available');
    expect(formatRateContext(Number.NaN)).toBe('Not available');
    expect(formatRateContext(Number.POSITIVE_INFINITY)).toBe('Not available');
    expect(formatMoney(Number.NaN, 'USD')).toBe('Not available');
    expect(formatMoney(Number.POSITIVE_INFINITY, 'USD')).toBe('Not available');
  });
  test('formats elapsed capture spans', () => {
    expect(formatTrackingSpan(1_000, 1_000 + 3_600_000 * 3.2)).toBe('3.2 hrs');
    expect(formatTrackingSpan(1_000, 1_000 + 30 * 60_000)).toBe('30 min');
    expect(formatTrackingSpan(1_000, 1_000)).toBe('Less than a minute');
    expect(formatTrackingSpan(0, 1_000)).toBe('Tracking time unavailable');
  });
  test('formats relative capture timestamps', () => {
    const now = 500_000_000;
    expect(formatRelativeCaptureTime(now, now)).toBe('Just now');
    expect(formatRelativeCaptureTime(now - 24 * 60_000, now)).toBe('24m ago');
    expect(formatRelativeCaptureTime(now - 3 * 3_600_000, now)).toBe('3h ago');
    expect(formatRelativeCaptureTime(now - 48 * 3_600_000, now)).toBe('2d ago');
    expect(formatRelativeCaptureTime(0, now)).toBe('Not available');
  });

  test('falls back to USD instead of throwing on malformed currency codes', () => {
    expect(() => formatMoney(100, 'US')).not.toThrow();
    expect(formatMoney(100, 'US')).toBe('$100.00');
    expect(() => formatMoney(100, 'DOLLARS')).not.toThrow();
    expect(formatMoney(100, 'DOLLARS')).toBe('$100.00');
  });
});
