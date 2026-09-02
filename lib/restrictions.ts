type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue | null {
  return typeof value === 'object' && value !== null ? (value as RecordValue) : null;
}

function meaningfulString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const label = value.trim();
  return label.length > 0 && label.toUpperCase() !== 'ANY' ? label : null;
}

function firstString(value: RecordValue, ...keys: string[]): string | null {
  for (const key of keys) {
    const label = meaningfulString(value[key]);
    if (label) return label;
  }
  return null;
}

function labels(value: unknown): string[] {
  const direct = meaningfulString(value);
  if (direct) return [direct];
  if (Array.isArray(value)) return value.flatMap((item) => labels(item));

  const object = record(value);
  if (!object) return [];
  const label = firstString(
    object,
    'name',
    'label',
    'value',
    'country',
    'state',
    'region',
    'city',
    'location',
    'timezone',
  );
  return label ? [label] : [];
}

function positiveNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;
}

function earningsLabel(value: unknown): string | null {
  const object = record(value);
  const amount =
    positiveNumber(value) ??
    positiveNumber(object?.amount) ??
    positiveNumber(object?.value) ??
    positiveNumber(object?.minimum) ??
    positiveNumber(object?.min);
  if (amount === null) return null;

  const currency = object
    ? (meaningfulString(object.currencyCode) ?? meaningfulString(object.currency))
    : null;
  return `${currency ? `${currency} ` : ''}${String(amount)}+ earnings`;
}

/** Returns only explicit, meaningful qualification restrictions. */
export function restrictionLabels(qualifications: unknown): string[] {
  const source = record(qualifications);
  if (!source) return [];

  const restrictions = [
    ...['countries', 'states', 'regions', 'locations', 'location', 'timezones'].flatMap((key) =>
      labels(source[key]),
    ),
  ];

  const minimumJobSuccessScore = positiveNumber(source.minJobSuccessScore);
  if (minimumJobSuccessScore !== null && minimumJobSuccessScore <= 100) {
    restrictions.push(`${String(minimumJobSuccessScore)}%+ JSS`);
  }

  const englishSkill = meaningfulString(source.prefEnglishSkill);
  if (englishSkill) restrictions.push(`English: ${englishSkill}`);

  const minimumHours = positiveNumber(source.minOdeskHours);
  if (minimumHours !== null) restrictions.push(`${String(minimumHours)}+ hours`);

  const minimumEarnings = earningsLabel(source.earnings);
  if (minimumEarnings) restrictions.push(minimumEarnings);

  const onSiteType = meaningfulString(source.onSiteType);
  if (onSiteType) restrictions.push(`On-site: ${onSiteType}`);

  if (source.shouldHavePortfolio === true) restrictions.push('Portfolio required');
  if (source.readyToStartToday === true) restrictions.push('Ready to start today');

  return [...new Set(restrictions)];
}

/** Alias emphasizing that this function parses the upstream qualification record. */
export const parseRestrictions = restrictionLabels;
