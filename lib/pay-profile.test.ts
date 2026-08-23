import { describe, expect, test } from 'bun:test';
import {
  averageRecentFixedPayment,
  deriveClientPayProfile,
  medianRecentFixedPayment,
  validHistoricalHourlyRates,
} from './pay-profile';
import type { PayProfileHistoryEntry } from './pay-profile';

const fixed = (amountPaid: number | null): PayProfileHistoryEntry => ({
  id: null,
  title: null,
  type: 'FIXED',
  amountPaid,
  feedbackScore: null,
  status: null,
  startedOn: null,
});

describe('client pay profile', () => {
  test('computes odd and even fixed-payment medians and average', () => {
    expect(medianRecentFixedPayment([fixed(100), fixed(300), fixed(200)])).toBe(200);
    expect(medianRecentFixedPayment([fixed(100), fixed(400), fixed(200), fixed(300)])).toBe(250);
    expect(averageRecentFixedPayment([fixed(100), fixed(400)])).toBe(250);
  });

  test('ignores missing, invalid, zero, and non-fixed payments', () => {
    const history = [fixed(null), fixed(0), fixed(-10), fixed(Number.NaN), { ...fixed(80), type: 'HOURLY' }];
    expect(medianRecentFixedPayment(history)).toBeNull();
    expect(averageRecentFixedPayment(history)).toBeNull();
  });

  test('keeps explicit positive hourly rates and excludes zero-hour entries', () => {
    const history: PayProfileHistoryEntry[] = [
      { ...fixed(400), type: 'HOURLY', hourlyRate: 40, hours: 10 },
      { ...fixed(500), type: 'HOURLY', hourlyRate: 50, hours: 0 },
      { ...fixed(600), type: 'FIXED', hourlyRate: 60, hours: 10 },
    ];
    expect(validHistoricalHourlyRates(history, [25, null, { hourlyRate: 30, hours: 0 }, { hourlyRate: 35, hours: 5 }])).toEqual([
      40,
      25,
      35,
    ]);
  });

  test('returns nullable no-data fields without inventing hourly rates', () => {
    expect(deriveClientPayProfile({ history: [] })).toEqual({
      totalCharges: null,
      averageHourlyRate: null,
      medianRecentFixedPayment: null,
      averageRecentFixedPayment: null,
      historicalHourlyRates: null,
    });
    expect(
      deriveClientPayProfile({
        history: [fixed(200)],
        client: { totalCharges: 0, averageHourlyRate: 0 },
      }),
    ).toEqual({
      totalCharges: 0,
      averageHourlyRate: null,
      medianRecentFixedPayment: 200,
      averageRecentFixedPayment: 200,
      historicalHourlyRates: null,
    });
  });
});
