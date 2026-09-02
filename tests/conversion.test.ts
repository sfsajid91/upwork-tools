import { describe, expect, test } from 'bun:test';
import { aggregateConversionStats } from '../lib/conversion';
import type { ApplicationRecord } from '../lib/storage';

const record = (overrides: Partial<ApplicationRecord> = {}): ApplicationRecord => ({
  jobId: 'job',
  state: null,
  viewedAt: null,
  appliedAt: null,
  interviewedAt: null,
  hiredAt: null,
  ...overrides,
});

describe('conversion stats', () => {
  test('excludes unknown and invited states from application counts', () => {
    expect(
      aggregateConversionStats([
        record({ state: 'applied' }),
        record({ state: 'invited' }),
        record({ appliedAt: 1 }),
        record({ interviewedAt: 2 }),
        record({ hiredAt: 3 }),
        record(),
      ]),
    ).toEqual({
      applications: 2,
      interviews: 1,
      hires: 1,
      applyToInterviewRate: 50,
      applyToInterviewDenominator: 2,
      interviewToHireRate: 100,
      interviewToHireDenominator: 1,
    });
  });

  test('ignores invalid application timestamps', () => {
    const stats = aggregateConversionStats([
      record({ appliedAt: 0 }),
      record({ appliedAt: -1 }),
      record({ appliedAt: 1.5 }),
      record({ interviewedAt: Number.NaN }),
      record({ hiredAt: 0 }),
      record({ hiredAt: -1 }),
      record({ hiredAt: 1.5 }),
    ]);

    expect(stats.applications).toBe(0);
    expect(stats.interviews).toBe(0);
    expect(stats.hires).toBe(0);
  });

  test('returns null rates and zero denominators when no stages are known', () => {
    expect(aggregateConversionStats([record(), record({ state: 'hired' })])).toEqual({
      applications: 0,
      interviews: 0,
      hires: 1,
      applyToInterviewRate: null,
      applyToInterviewDenominator: 0,
      interviewToHireRate: null,
      interviewToHireDenominator: 0,
    });
  });

  test('reports sample sizes and exact percentages', () => {
    const stats = aggregateConversionStats([
      record({ appliedAt: 1 }),
      record({ appliedAt: 2, interviewedAt: 3 }),
      record({ appliedAt: 4, interviewedAt: 5, hiredAt: 6 }),
      record({ state: 'invited', interviewedAt: 7 }),
    ]);

    expect(stats.applications).toBe(3);
    expect(stats.interviews).toBe(3);
    expect(stats.hires).toBe(1);
    expect(stats.applyToInterviewDenominator).toBe(3);
    expect(stats.interviewToHireDenominator).toBe(3);
    expect(stats.applyToInterviewRate).toBe(100);
    expect(stats.interviewToHireRate).toBe((1 / 3) * 100);
  });

  test('uses independent denominators for each rate', () => {
    const stats = aggregateConversionStats([
      record({ appliedAt: 1 }),
      record({ appliedAt: 2, interviewedAt: 3 }),
      record({ interviewedAt: 4, hiredAt: 5 }),
    ]);

    expect(stats).toEqual({
      applications: 2,
      interviews: 2,
      hires: 1,
      applyToInterviewRate: 100,
      applyToInterviewDenominator: 2,
      interviewToHireRate: 50,
      interviewToHireDenominator: 2,
    });
  });
});
