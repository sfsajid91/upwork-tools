import { describe, expect, test } from 'bun:test';
import { queryJobSnapshots, summarizeJobSnapshots } from './history';
import type { JobSnapshotRecord } from './storage';

const snapshot = (jobId: string, capturedAt: number, id?: number): JobSnapshotRecord => ({
  id,
  jobId,
  applicants: 1,
  interviewed: 2,
  hired: 3,
  positions: 4,
  capturedAt,
});

describe('job snapshot history', () => {
  test('orders captures by time and uses id as a stable tie-breaker', () => {
    const records = [snapshot('job-1', 30, 3), snapshot('job-1', 10, 2), snapshot('job-1', 10, 1)];

    expect(queryJobSnapshots(records, 'job-1').map((record) => record.id)).toEqual([1, 2, 3]);
    expect(records.map((record) => record.id)).toEqual([3, 2, 1]);
  });

  test('isolates results to the caller-provided job ID', () => {
    const records = [snapshot('job-1', 10), snapshot('job-2', 20)];

    expect(queryJobSnapshots(records, 'job-1').map((record) => record.jobId)).toEqual(['job-1']);
    expect(summarizeJobSnapshots(records, 'job-2')?.latest?.jobId).toBe('job-2');
  });

  test('ignores missing or invalid timestamps and rejects invalid IDs in summaries', () => {
    const records = [
      snapshot('job-1', 20),
      { ...snapshot('job-1', 10), capturedAt: undefined },
      { ...snapshot('job-1', 30), capturedAt: Number.NaN },
    ] as unknown as JobSnapshotRecord[];

    expect(queryJobSnapshots(records, 'job-1').map((record) => record.capturedAt)).toEqual([20]);
    expect(summarizeJobSnapshots(records, '')).toBeNull();
    expect(summarizeJobSnapshots(records, 'missing')).toBeNull();
  });

  test('summarizes a single snapshot without inventing a previous capture', () => {
    const only = snapshot('job-1', 10, 7);
    const summary = summarizeJobSnapshots([only], 'job-1');

    expect(summary).toEqual({
      snapshots: [only],
      latest: only,
      firstSeen: only,
      recent: [only],
      previous: null,
    });
  });
});
