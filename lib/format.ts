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
