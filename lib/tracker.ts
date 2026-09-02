import type { ApplicationState } from './insights';
import type { ApplicationRecord } from './storage';

/** A locally tracked application record contains only factual job events. */
export type TrackerRecord = ApplicationRecord;

export type TrackerTimestamp = number | null | undefined;

/**
 * Events that can be recorded without guessing from a job view.
 * Application states are explicitly marked observed; manual input is not part
 * of this persisted contract and therefore cannot be mistaken for observed data.
 */
export type TrackerTransition =
  | { type: 'viewed'; at: TrackerTimestamp }
  | { type: 'observed-state'; state: ApplicationState; at: TrackerTimestamp }
  | { type: 'interviewed'; at: TrackerTimestamp }
  | { type: 'hired'; at: TrackerTimestamp };

const APPLICATION_STATES: readonly ApplicationState[] = ['applied', 'invited', 'hired'];

function isApplicationState(value: unknown): value is ApplicationState {
  return typeof value === 'string' && APPLICATION_STATES.includes(value as ApplicationState);
}

function timestamp(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;
}

function laterTimestamp(current: unknown, incoming: unknown): number | null {
  const currentValue = timestamp(current);
  const incomingValue = timestamp(incoming);
  if (currentValue === null) return incomingValue;
  if (incomingValue === null) return currentValue;
  return Math.max(currentValue, incomingValue);
}

function copyRecord(record: ApplicationRecord): ApplicationRecord {
  return {
    jobId: record.jobId,
    state: record.state,
    viewedAt: timestamp(record.viewedAt),
    appliedAt: timestamp(record.appliedAt),
    interviewedAt: timestamp(record.interviewedAt),
    hiredAt: timestamp(record.hiredAt),
  };
}

/** Creates the empty local tracker value for one job. */
export function createApplicationRecord(jobId: string): ApplicationRecord {
  return {
    jobId,
    state: null,
    viewedAt: null,
    appliedAt: null,
    interviewedAt: null,
    hiredAt: null,
  };
}

function stateRank(state: ApplicationState): number {
  if (state === 'hired') return 3;
  return state === 'applied' ? 2 : 1;
}

/**
 * Chooses a state without replacing a known state with an older or unknown one.
 * Equal-rank states retain the existing value, making merges deterministic.
 */
function mergeState(current: unknown, incoming: unknown): ApplicationState | null {
  if (isApplicationState(current)) {
    if (!isApplicationState(incoming) || stateRank(current) >= stateRank(incoming)) return current;
    return incoming;
  }
  if (typeof current === 'string') return current as ApplicationState;
  if (typeof incoming === 'string') return incoming as ApplicationState;
  return null;
}

/**
 * Applies one explicit tracker event. A viewed event only records viewedAt;
 * opening a job never creates an applied state or timestamp.
 */
export function transitionApplicationRecord(
  record: ApplicationRecord,
  transition: TrackerTransition,
): ApplicationRecord {
  const next = copyRecord(record);
  if (transition.type === 'viewed') {
    next.viewedAt = laterTimestamp(next.viewedAt, transition.at);
  } else if (transition.type === 'observed-state') {
    next.state = mergeState(next.state, transition.state);
    if (transition.state === 'applied')
      next.appliedAt = laterTimestamp(next.appliedAt, transition.at);
    if (transition.state === 'hired') next.hiredAt = laterTimestamp(next.hiredAt, transition.at);
  } else if (transition.type === 'interviewed') {
    next.interviewedAt = laterTimestamp(next.interviewedAt, transition.at);
  } else if (transition.type === 'hired') {
    next.state = mergeState(next.state, 'hired');
    next.hiredAt = laterTimestamp(next.hiredAt, transition.at);
  }
  return next;
}

/** Merges two captures for the same job without regressing factual state or timestamps. */
export function mergeApplicationRecords(
  current: ApplicationRecord,
  incoming: ApplicationRecord,
): ApplicationRecord {
  if (current.jobId !== incoming.jobId) return copyRecord(current);
  return {
    jobId: current.jobId,
    state: mergeState(current.state, incoming.state),
    viewedAt: laterTimestamp(current.viewedAt, incoming.viewedAt),
    appliedAt: laterTimestamp(current.appliedAt, incoming.appliedAt),
    interviewedAt: laterTimestamp(current.interviewedAt, incoming.interviewedAt),
    hiredAt: laterTimestamp(current.hiredAt, incoming.hiredAt),
  };
}

export const transitionTracker = transitionApplicationRecord;
export const mergeTrackerRecords = mergeApplicationRecords;
