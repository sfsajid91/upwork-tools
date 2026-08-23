import { describe, expect, test } from 'bun:test';
import {
  createApplicationRecord,
  mergeApplicationRecords,
  transitionApplicationRecord,
} from './tracker';

const viewed = 1_000;

describe('application tracker', () => {
  test('records a view without inferring an application', () => {
    const record = transitionApplicationRecord(createApplicationRecord('job-1'), {
      type: 'viewed',
      at: viewed,
    });

    expect(record).toEqual({
      jobId: 'job-1',
      state: null,
      viewedAt: viewed,
      appliedAt: null,
      interviewedAt: null,
      hiredAt: null,
    });
  });

  test('records observed applied and invited states separately', () => {
    const applied = transitionApplicationRecord(createApplicationRecord('job-1'), {
      type: 'observed-state',
      state: 'applied',
      at: 2_000,
    });
    const invited = transitionApplicationRecord(createApplicationRecord('job-2'), {
      type: 'observed-state',
      state: 'invited',
      at: 3_000,
    });
    const invitedThenApplied = transitionApplicationRecord(invited, {
      type: 'observed-state',
      state: 'applied',
      at: 4_000,
    });

    expect(applied.state).toBe('applied');
    expect(applied.appliedAt).toBe(2_000);
    expect(invited.state).toBe('invited');
    expect(invited.appliedAt).toBeNull();
    expect(invitedThenApplied.state).toBe('applied');
    expect(invitedThenApplied.appliedAt).toBe(4_000);
  });

  test('records observed interview and hire events', () => {
    const record = transitionApplicationRecord(
      transitionApplicationRecord(createApplicationRecord('job-1'), {
        type: 'interviewed',
        at: 4_000,
      }),
      { type: 'hired', at: 5_000 },
    );

    expect(record.interviewedAt).toBe(4_000);
    expect(record.state).toBe('hired');
    expect(record.hiredAt).toBe(5_000);
    expect(record.appliedAt).toBeNull();
  });

  test('keeps timestamps monotonic when events arrive out of order', () => {
    const later = transitionApplicationRecord(
      transitionApplicationRecord(createApplicationRecord('job-1'), {
        type: 'viewed',
        at: 5_000,
      }),
      { type: 'viewed', at: 2_000 },
    );
    const merged = mergeApplicationRecords(
      transitionApplicationRecord(createApplicationRecord('job-1'), {
        type: 'interviewed',
        at: 8_000,
      }),
      transitionApplicationRecord(createApplicationRecord('job-1'), {
        type: 'interviewed',
        at: 3_000,
      }),
    );

    expect(later.viewedAt).toBe(5_000);
    expect(merged.interviewedAt).toBe(8_000);
  });

  test('does not regress known state or erase an unknown state', () => {
    const hired = transitionApplicationRecord(
      transitionApplicationRecord(createApplicationRecord('job-1'), {
        type: 'hired',
        at: 5_000,
      }),
      { type: 'observed-state', state: 'applied', at: 6_000 },
    );
    const unknown = mergeApplicationRecords(
      { ...createApplicationRecord('job-2'), state: 'withdrawn' as never },
      { ...createApplicationRecord('job-2'), state: 'applied' },
    );
    const unknownIncoming = mergeApplicationRecords(createApplicationRecord('job-3'), {
      ...createApplicationRecord('job-3'),
      state: 'withdrawn' as never,
    });
    const knownIncoming = mergeApplicationRecords(
      { ...createApplicationRecord('job-4'), state: 'applied' },
      { ...createApplicationRecord('job-4'), state: 'withdrawn' as never },
    );

    expect(hired.state).toBe('hired');
    expect(unknown.state).toBe('withdrawn');
    expect(unknownIncoming.state).toBe('withdrawn');
    expect(knownIncoming.state).toBe('applied');
  });

  test('does not create bid or Connect fields', () => {
    const record = transitionApplicationRecord(createApplicationRecord('job-1'), {
      type: 'observed-state',
      state: 'applied',
      at: viewed,
    });

    expect('bid' in record).toBe(false);
    expect('connects' in record).toBe(false);
    expect('connectsSpent' in record).toBe(false);
  });
});
