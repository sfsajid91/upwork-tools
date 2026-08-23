import { describe, expect, test } from 'bun:test';
import { aggregateConversionStats, type ConversionStats } from '../lib/conversion';
import type { ApplicationRecord } from '../lib/storage';
import { createApplicationRecord, transitionApplicationRecord } from '../lib/tracker';

const record = (jobId: string, overrides: Partial<ApplicationRecord> = {}): ApplicationRecord => ({
  jobId,
  state: null,
  viewedAt: null,
  appliedAt: null,
  interviewedAt: null,
  hiredAt: null,
  ...overrides,
});

const stats = (records: readonly ApplicationRecord[]): ConversionStats =>
  aggregateConversionStats(records);

describe('observed tracker transitions and conversion', () => {
  test('moves through observed stages without treating a view as an application', () => {
    const viewed = transitionApplicationRecord(createApplicationRecord('job-1'), {
      type: 'viewed',
      at: 1_000,
    });
    const applied = transitionApplicationRecord(viewed, {
      type: 'observed-state',
      state: 'applied',
      at: 2_000,
    });
    const interviewed = transitionApplicationRecord(applied, {
      type: 'interviewed',
      at: 3_000,
    });
    const hired = transitionApplicationRecord(interviewed, {
      type: 'hired',
      at: 4_000,
    });

    expect(viewed).toMatchObject({
      state: null,
      viewedAt: 1_000,
      appliedAt: null,
      interviewedAt: null,
      hiredAt: null,
    });
    expect(hired).toMatchObject({
      state: 'hired',
      viewedAt: 1_000,
      appliedAt: 2_000,
      interviewedAt: 3_000,
      hiredAt: 4_000,
    });
  });

  test('keeps known stages and timestamps when observations arrive out of order', () => {
    const recordAtLaterState = transitionApplicationRecord(
      transitionApplicationRecord(createApplicationRecord('job-2'), {
        type: 'hired',
        at: 5_000,
      }),
      { type: 'observed-state', state: 'applied', at: 9_000 },
    );

    expect(recordAtLaterState.state).toBe('hired');
    expect(recordAtLaterState.hiredAt).toBe(5_000);
    expect(recordAtLaterState.appliedAt).toBe(9_000);
  });

  test('excludes unknown states from stage counts and uses each stage denominator', () => {
    const result = stats([
      record('applied-state', { state: 'applied' }),
      record('interviewed-state', { appliedAt: 1, interviewedAt: 2 }),
      record('application-only', { appliedAt: 5 }),
      record('hired-state', { interviewedAt: 3, hiredAt: 4 }),
      record('invited-state', { state: 'invited' }),
      record('unknown-state', { state: 'withdrawn' as never }),
      record('empty-state'),
    ]);

    expect(result).toEqual({
      applications: 3,
      interviews: 2,
      hires: 1,
      applyToInterviewRate: (2 / 3) * 100,
      applyToInterviewDenominator: 3,
      interviewToHireRate: 50,
      interviewToHireDenominator: 2,
    });
  });

  test('returns null rates when their factual denominator is empty', () => {
    expect(
      stats([
        record('unknown', { state: 'withdrawn' as never }),
        record('invited', { state: 'invited' }),
      ]),
    ).toEqual({
      applications: 0,
      interviews: 0,
      hires: 0,
      applyToInterviewRate: null,
      applyToInterviewDenominator: 0,
      interviewToHireRate: null,
      interviewToHireDenominator: 0,
    });
  });
});
