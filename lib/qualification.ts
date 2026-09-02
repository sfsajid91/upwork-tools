export interface QualificationDetail {
  requirementName: string;
  clientLabel: string;
  freelancerValue: string | null;
  freelancerLabel: string | null;
  matched: boolean;
}

export interface QualificationSummary {
  matched: number;
  total: number;
  details: QualificationDetail[];
}

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue | null {
  return typeof value === 'object' && value !== null ? (value as RecordValue) : null;
}

function text(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function firstText(...values: unknown[]): string | null {
  for (const value of values) {
    const normalized = text(value);
    if (normalized !== null) return normalized;
  }
  return null;
}

function normalized(value: string | null): string {
  return value?.trim().toLowerCase() ?? '';
}

function isAny(value: string | null): boolean {
  return normalized(value) === 'any' || normalized(value) === 'all';
}

function isDefaultLabel(value: string | null): boolean {
  return ['false', 'no', 'none', 'no preference', 'not required', 'not specified'].includes(
    normalized(value),
  );
}

function requirementKey(value: string): string {
  return value.replace(/[\s_-]+/g, '').toLowerCase();
}

function isJssRequirement(requirementName: string): boolean {
  const key = requirementKey(requirementName);
  return key.includes('jobsuccess') || key.includes('jss');
}

function isDefaultZeroRequirement(requirementName: string): boolean {
  const key = requirementKey(requirementName);
  return (
    isJssRequirement(requirementName) ||
    key.includes('hoursbilled') ||
    key.includes('odeskhours') ||
    key.includes('earnings')
  );
}

function isZero(value: string | null): boolean {
  return (
    value !== null &&
    /^(?:at least\s+)?0+(?:\.0+)?(?:%\+?|\+?\s*(?:hours?|years?)|\+)?$/i.test(value)
  );
}

function isMeaninglessClientRequirement(
  requirementName: string,
  preferred: string | null,
  clientLabel: string | null,
): boolean {
  if (preferred === null && clientLabel === null) return true;
  if (isAny(preferred) || isAny(clientLabel)) return true;
  if (
    normalized(preferred) === 'false' ||
    (normalized(preferred) === '0' && isJssRequirement(requirementName))
  )
    return true;
  if (isDefaultLabel(clientLabel)) return true;
  if (isDefaultZeroRequirement(requirementName) && (isZero(preferred) || isZero(clientLabel)))
    return true;
  return false;
}

function matchesFrom(value: unknown): readonly unknown[] {
  if (Array.isArray(value)) return value;
  const source = record(value);
  if (!source) return [];
  if (Array.isArray(source.matches)) return source.matches;

  const jobAuthDetails =
    record(source.jobAuthDetails) ?? record(record(source.data)?.jobAuthDetails);
  if (jobAuthDetails) return matchesFrom(jobAuthDetails);
  const freelancerInfo = record(source.freelancerInfo);
  const qualificationsMatches = record(source.qualificationsMatches);
  if (Array.isArray(qualificationsMatches?.matches)) return qualificationsMatches.matches;
  const directMatches = record(freelancerInfo?.qualificationsMatches)?.matches;
  if (Array.isArray(directMatches)) return directMatches;

  const currentUserInfo = record(source.currentUserInfo);
  const nestedFreelancerInfo = record(currentUserInfo?.freelancerInfo);
  const nestedMatches = record(nestedFreelancerInfo?.qualificationsMatches);
  return Array.isArray(nestedMatches?.matches) ? nestedMatches.matches : [];
}

function detailFrom(value: unknown): QualificationDetail | null {
  const source = record(value);
  if (!source || typeof source.qualified !== 'boolean') return null;

  const requirementName = firstText(
    source.qualification,
    source.requirementName,
    source.requirement,
    source.name,
  );
  if (!requirementName) return null;

  const preferred = firstText(source.clientPreferred, source.clientValue);
  const clientLabel = firstText(source.clientPreferredLabel, source.clientLabel);
  if (
    source.clientPreferred === false ||
    isMeaninglessClientRequirement(requirementName, preferred, clientLabel) ||
    !clientLabel
  )
    return null;

  const freelancerValue = firstText(source.freelancerValue, source.value);
  const freelancerLabel = firstText(source.freelancerValueLabel, source.freelancerLabel);

  return {
    requirementName,
    clientLabel,
    freelancerValue,
    freelancerLabel,
    matched: source.qualified,
  };
}

/** Extracts meaningful qualification records without mutating the source payload. */
export function parseQualificationMatches(value: unknown): QualificationDetail[] {
  return matchesFrom(value).flatMap((match) => {
    const detail = detailFrom(match);
    return detail ? [detail] : [];
  });
}

/** Builds the compact matched/total summary and expandable-ready details. */
export function summarizeQualificationMatches(value: unknown): QualificationSummary {
  const details = parseQualificationMatches(value);
  return {
    matched: details.filter((detail) => detail.matched).length,
    total: details.length,
    details,
  };
}

export const normalizeQualificationMatches = parseQualificationMatches;
export const deriveQualificationSummary = summarizeQualificationMatches;
