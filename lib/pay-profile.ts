import type { ClientHistoryEntry, JobInsights } from './insights';

/** Normalized history may carry explicit hourly fields when the source provides them. */
export interface PayProfileHistoryEntry extends ClientHistoryEntry {
  hours?: number | null;
  hourlyRate?: number | null;
}

export interface HistoricalHourlyRateRecord {
  hourlyRate?: number | null;
  hours?: number | null;
}

export interface ClientPayProfileInput {
  client?: Pick<JobInsights['client'], 'totalCharges' | 'averageHourlyRate'> | null;
  history?: readonly PayProfileHistoryEntry[] | null;
  historicalHourlyRates?:
    | readonly (number | null | undefined | HistoricalHourlyRateRecord)[]
    | null;
}

export interface ClientPayProfile {
  totalCharges: number | null;
  averageHourlyRate: number | null;
  medianRecentFixedPayment: number | null;
  averageRecentFixedPayment: number | null;
  historicalHourlyRates: number[] | null;
}

function positiveFinite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function fixedPayments(history: readonly PayProfileHistoryEntry[] | null | undefined): number[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (entry): entry is PayProfileHistoryEntry & { amountPaid: number } =>
        entry?.type?.trim().toUpperCase() === 'FIXED' && positiveFinite(entry.amountPaid),
    )
    .map((entry) => entry.amountPaid)
    .sort((left, right) => left - right);
}

/** Returns the median of positive fixed-payment history, or null when unavailable. */
export function medianRecentFixedPayment(
  history: readonly PayProfileHistoryEntry[] | null | undefined,
): number | null {
  const payments = fixedPayments(history);
  if (payments.length === 0) return null;
  const middle = Math.floor(payments.length / 2);
  const upper = payments[middle];
  if (upper === undefined) return null;
  if (payments.length % 2 === 1) return upper;
  const lower = payments[middle - 1];
  return lower === undefined ? null : (lower + upper) / 2;
}

/** Returns the average of positive fixed-payment history, or null when unavailable. */
export function averageRecentFixedPayment(
  history: readonly PayProfileHistoryEntry[] | null | undefined,
): number | null {
  const payments = fixedPayments(history);
  return payments.length === 0
    ? null
    : payments.reduce((sum, payment) => sum + payment, 0) / payments.length;
}
function validSuppliedHourlyRate(value: unknown, hours: unknown = undefined): value is number {
  if (!positiveFinite(value)) return false;
  return (
    hours === undefined ||
    hours === null ||
    (typeof hours === 'number' && Number.isFinite(hours) && hours > 0)
  );
}

/**
 * Keeps only explicit, positive historical hourly rates. No fixed payment is
 * divided by hours, and entries with zero hours are excluded.
 */
export function validHistoricalHourlyRates(
  history: readonly PayProfileHistoryEntry[] | null | undefined,
  supplied:
    | readonly (number | null | undefined | HistoricalHourlyRateRecord)[]
    | null
    | undefined = null,
): number[] {
  const rates: number[] = [];
  if (Array.isArray(history)) {
    for (const entry of history) {
      const hourlyRate = entry?.hourlyRate;
      if (
        entry?.type?.trim().toUpperCase() !== 'FIXED' &&
        validSuppliedHourlyRate(hourlyRate, entry?.hours)
      ) {
        rates.push(hourlyRate);
      }
    }
  }
  if (Array.isArray(supplied)) {
    for (const record of supplied) {
      if (typeof record === 'number') {
        if (validSuppliedHourlyRate(record)) rates.push(record);
      } else if (record) {
        const hourlyRate = record.hourlyRate;
        if (validSuppliedHourlyRate(hourlyRate, record.hours)) rates.push(hourlyRate);
      }
    }
  }
  return rates;
}

/** Derives factual client pay fields from normalized summary and history data. */
export function deriveClientPayProfile(input: ClientPayProfileInput = {}): ClientPayProfile {
  const history = input.history;
  const client = input.client;
  const hourlyRates = validHistoricalHourlyRates(history, input.historicalHourlyRates);
  return {
    totalCharges:
      typeof client?.totalCharges === 'number' && Number.isFinite(client.totalCharges)
        ? client.totalCharges
        : null,
    averageHourlyRate: positiveFinite(client?.averageHourlyRate) ? client.averageHourlyRate : null,
    medianRecentFixedPayment: medianRecentFixedPayment(history),
    averageRecentFixedPayment: averageRecentFixedPayment(history),
    historicalHourlyRates: hourlyRates.length > 0 ? hourlyRates : null,
  };
}

export function formatPayProfileValue(value: number | null): string {
  return value === null ? 'Not available' : String(value);
}
