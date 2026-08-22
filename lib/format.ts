export function formatNumber(value: number | null): string {
  return value === null ? 'Not available' : new Intl.NumberFormat().format(value);
}

export function formatMoney(amount: number | null, currency: string | null): string {
  if (amount === null) return 'Not available';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency ?? 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number | null): string {
  return value === null ? 'Not available' : `${value.toFixed(1)}%`;
}

export function formatRating(value: number | null): string {
  return value === null ? 'Not available' : value.toFixed(2);
}

export function formatRateContext(value: number | null): string {
  return value === null ? 'Not available' : `~${value.toFixed(1)}× client average`;
}

export function formatJobStatus(value: string | null): string {
  if (!value) return 'Status not available';
  return value.toLowerCase() === 'filled'
    ? 'Filled'
    : value.toLowerCase() === 'open'
      ? 'Open'
      : value;
}

export function formatApplicationState(value: 'applied' | 'invited' | 'hired' | null): string {
  if (value === 'applied') return 'Already applied';
  if (value === 'invited') return 'Client invited you';
  if (value === 'hired') return 'Already hired';
  return 'No application signal';
}

export function formatDate(value: string | null): string {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString();
}

export function formatRelativeTime(value: string | null): string {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  const hours = Math.round((Date.now() - date.getTime()) / 3_600_000);
  if (hours < 1) return 'Less than an hour ago';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
