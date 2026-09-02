import { describe, expect, test } from 'bun:test';
import { calculateProposalVelocity, formatProposalVelocity } from '../../src/lib/velocity';

const hour = 3_600_000;
const start = Date.UTC(2026, 0, 1);

describe('proposal velocity', () => {
  test('calculates exactly one hour and preserves zero applicants', () => {
    expect(calculateProposalVelocity(2, 6, start, start + hour)).toBe(4);
    expect(calculateProposalVelocity(0, 0, start, start + hour)).toBe(0);
  });

  test('hides intervals shorter than one hour', () => {
    expect(calculateProposalVelocity(2, 6, start, start + hour - 1)).toBeNull();
  });

  test('keeps zero and negative deltas factual', () => {
    expect(calculateProposalVelocity(6, 6, start, start + hour)).toBe(0);
    expect(calculateProposalVelocity(6, 2, start, start + hour)).toBe(-4);
  });

  test('hides missing, invalid, and out-of-order observations', () => {
    expect(calculateProposalVelocity(null, 2, start, start + hour)).toBeNull();
    expect(calculateProposalVelocity(1, 2, 'invalid', start + hour)).toBeNull();
    expect(calculateProposalVelocity(1, 2, start + hour, start)).toBeNull();
    expect(calculateProposalVelocity(1, 2, start, start)).toBeNull();
  });

  test('formats only a factual rate', () => {
    expect(formatProposalVelocity(2.5)).toBe('2.5 applicants/hour');
    expect(formatProposalVelocity(null)).toBe('Not available');
  });
  test('rounds calculated and displayed velocity to one decimal place', () => {
    expect(calculateProposalVelocity(0, 1, start, start + 3 * hour)).toBe(0.3);
    expect(formatProposalVelocity(2)).toBe('2.0 applicants/hour');
    expect(formatProposalVelocity(-0.26)).toBe('-0.3 applicants/hour');
  });
});
