import { describe, expect, test } from 'bun:test';
import { deriveHiringWarnings } from './hiring-warnings';

describe('hiring warnings', () => {
  test('marks filled status and leaves open status unfilled', () => {
    expect(deriveHiringWarnings({ status: 'FILLED' })).toMatchObject({
      positionFilled: true,
      labels: ['position-filled'],
    });
    expect(deriveHiringWarnings({ status: 'OPEN' })).toMatchObject({
      positionFilled: false,
      labels: [],
    });
  });

  test('uses hired and position counts as client signals', () => {
    expect(
      deriveHiringWarnings({ status: 'OPEN', totalHired: 1, positionsToHire: 1 }),
    ).toMatchObject({
      positionFilled: true,
      clientHasHires: true,
      labels: ['position-filled', 'client-has-hires'],
    });
    expect(
      deriveHiringWarnings({ status: 'OPEN', totalHired: 0, positionsToHire: 1 }),
    ).toMatchObject({
      positionFilled: false,
      clientHasHires: false,
      labels: [],
    });
    expect(
      deriveHiringWarnings({ status: 'OPEN', totalHired: 0, positionsToHire: 0 }),
    ).toMatchObject({
      positionFilled: false,
      clientHasHires: false,
    });
  });

  test('keeps current-user application states distinct from client hires', () => {
    expect(deriveHiringWarnings({ totalHired: 1, positionsToHire: 2 })).toMatchObject({
      clientHasHires: true,
      currentUserHired: false,
      currentUserApplied: false,
      currentUserInvited: false,
      labels: ['client-has-hires'],
    });
    expect(deriveHiringWarnings({ applicationState: 'hired' })).toMatchObject({
      clientHasHires: false,
      currentUserHired: true,
      labels: ['already-hired'],
    });
    expect(deriveHiringWarnings({ applicationState: 'applied' })).toMatchObject({
      currentUserApplied: true,
      labels: ['already-applied'],
    });
    expect(deriveHiringWarnings({ applicationState: 'invited' })).toMatchObject({
      currentUserInvited: true,
      labels: ['client-invited'],
    });
  });

  test('excludes the current job from optional same-job history', () => {
    expect(
      deriveHiringWarnings({
        currentJobId: 'job-1',
        sameJobHistory: [{ id: 'job-1' }],
      }),
    ).toMatchObject({ hasSameJobHistory: false, labels: [] });
    expect(
      deriveHiringWarnings({
        currentJobId: '  job-1  ',
        sameJobHistory: [{ id: 'job-1' }],
      }),
    ).toMatchObject({ hasSameJobHistory: false, labels: [] });
    expect(
      deriveHiringWarnings({
        currentJobId: 'job-1',
        sameJobHistory: [{ id: '  job-1  ' }],
      }),
    ).toMatchObject({ hasSameJobHistory: false, labels: [] });
    expect(
      deriveHiringWarnings({
        currentJobId: 'job-1',
        sameJobHistory: [{ id: 'job-1' }, { id: 'job-2' }],
      }),
    ).toMatchObject({ hasSameJobHistory: true, labels: ['same-job-history'] });
  });
});
