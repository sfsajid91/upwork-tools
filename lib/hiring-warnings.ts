export type HiringApplicationState = 'applied' | 'invited' | 'hired';

export type HiringWarningLabel =
  | 'position-filled'
  | 'client-has-hires'
  | 'already-hired'
  | 'already-applied'
  | 'client-invited'
  | 'same-job-history';

export interface HiringHistoryEntry {
  id: string | null;
}

export interface HiringWarningsInput {
  status?: string | null;
  totalHired?: number | null;
  positionsToHire?: number | null;
  applicationState?: HiringApplicationState | null;
  currentJobId?: string | null;
  sameJobHistory?: readonly HiringHistoryEntry[] | null;
}

export interface HiringWarnings {
  labels: HiringWarningLabel[];
  positionFilled: boolean;
  clientHasHires: boolean;
  currentUserHired: boolean;
  currentUserApplied: boolean;
  currentUserInvited: boolean;
  hasSameJobHistory: boolean;
}

function validCount(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function hasHistoryAfterIdentityFilter(
  history: readonly HiringHistoryEntry[] | null | undefined,
  currentJobId: string | null | undefined,
): boolean {
  if (!Array.isArray(history)) return false;
  const identity =
    typeof currentJobId === 'string' && currentJobId.trim() !== '' ? currentJobId.trim() : null;
  return history.some((entry) => {
    const entryIdentity = typeof entry.id === 'string' ? entry.id.trim() : null;
    return identity === null || entryIdentity !== identity;
  });
}

/** Combines factual hiring signals without inferring a freelancer hire from client counts. */
export function deriveHiringWarnings(input: HiringWarningsInput = {}): HiringWarnings {
  const statusFilled = input.status?.trim().toUpperCase() === 'FILLED';
  const countsFilled =
    validCount(input.totalHired) &&
    validCount(input.positionsToHire) &&
    input.positionsToHire > 0 &&
    input.totalHired >= input.positionsToHire;
  const positionFilled = statusFilled || countsFilled;
  const clientHasHires = validCount(input.totalHired) && input.totalHired > 0;
  const currentUserHired = input.applicationState === 'hired';
  const currentUserApplied = input.applicationState === 'applied';
  const currentUserInvited = input.applicationState === 'invited';
  const hasSameJobHistory = hasHistoryAfterIdentityFilter(input.sameJobHistory, input.currentJobId);
  const labels: HiringWarningLabel[] = [];

  if (positionFilled) labels.push('position-filled');
  if (clientHasHires) labels.push('client-has-hires');
  if (currentUserHired) labels.push('already-hired');
  if (currentUserApplied) labels.push('already-applied');
  if (currentUserInvited) labels.push('client-invited');
  if (hasSameJobHistory) labels.push('same-job-history');

  return {
    labels,
    positionFilled,
    clientHasHires,
    currentUserHired,
    currentUserApplied,
    currentUserInvited,
    hasSameJobHistory,
  };
}
