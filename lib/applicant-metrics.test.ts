import { describe, expect, test } from 'bun:test';
import type { ApplicantSnapshot } from './applicant-metrics';
import {
  deriveApplicantMetrics,
  firstSeenApplicantDelta,
  latestApplicantCount,
  recentApplicantDelta,
} from './applicant-metrics';

const snapshot = (capturedAt: number, applicants: number | null): ApplicantSnapshot => ({
  capturedAt,
  applicants,
});

describe('applicant metrics', () => {
  test('preserves zero counts', () => {
    const snapshots = [snapshot(1_000, 0), snapshot(2_000, 3)];

    expect(deriveApplicantMetrics(snapshots)).toEqual({
      latestApplicantCount: 3,
      firstSeenDelta: 3,
      recentDelta: 3,
    });
  });

  test('returns the latest count but no deltas for one snapshot', () => {
    const snapshots = [snapshot(1_000, 4)];

    expect(latestApplicantCount(snapshots)).toBe(4);
    expect(firstSeenApplicantDelta(snapshots)).toBeNull();
    expect(recentApplicantDelta(snapshots)).toBeNull();
  });

  test('computes first-seen and recent deltas from two snapshots', () => {
    const snapshots = [snapshot(1_000, 8), snapshot(7_000, 13)];

    expect(firstSeenApplicantDelta(snapshots)).toBe(5);
    expect(recentApplicantDelta(snapshots)).toBe(5);
  });

  test('returns null deltas when either required count is missing', () => {
    expect(firstSeenApplicantDelta([snapshot(1_000, null), snapshot(2_000, 2)])).toBeNull();
    expect(recentApplicantDelta([snapshot(1_000, 1), snapshot(2_000, null)])).toBeNull();
    expect(latestApplicantCount([snapshot(1_000, null)])).toBeNull();
  });

  test('rejects invalid timestamps and out-of-order snapshots', () => {
    const invalidTimestamp = [snapshot(Number.NaN, 1), snapshot(2_000, 2)];
    const outOfOrder = [snapshot(2_000, 1), snapshot(1_000, 2)];

    expect(deriveApplicantMetrics(invalidTimestamp)).toEqual({
      latestApplicantCount: null,
      firstSeenDelta: null,
      recentDelta: null,
    });
    expect(deriveApplicantMetrics(outOfOrder)).toEqual({
      latestApplicantCount: null,
      firstSeenDelta: null,
      recentDelta: null,
    });
  });
});
