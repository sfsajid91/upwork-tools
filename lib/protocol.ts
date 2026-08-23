import { isJobInsights, type JobInsights } from './insights';
import type { ClientPayProfile } from './pay-profile';

export interface JobHistoryApplicantSummary {
  snapshotCount: number;
  latestApplicants: number | null;
  firstSeenApplicants: number | null;
  firstSeenDelta: number | null;
  recentDelta: number | null;
}

export interface JobHistoryResponse {
  jobId: string;
  summary: JobHistoryApplicantSummary | null;
  velocity: number | null;
  payProfile: ClientPayProfile;
}
export const PAGE_EVENT_SOURCE = 'upwork-tools';
export const PAGE_EVENT_VERSION = 1;
export const PAGE_EVENT_TYPE = 'JOB_DETAILS_RECEIVED';
export const STORE_JOB_INSIGHTS = 'STORE_JOB_INSIGHTS';
export const GET_JOB_INSIGHTS = 'GET_JOB_INSIGHTS';
export const GET_JOB_HISTORY = 'GET_JOB_HISTORY';

export interface PageEvent {
  source: typeof PAGE_EVENT_SOURCE;
  version: typeof PAGE_EVENT_VERSION;
  type: typeof PAGE_EVENT_TYPE;
  payload: JobInsights;
}

export type RuntimeMessage =
  | { type: typeof STORE_JOB_INSIGHTS; payload: JobInsights }
  | { type: typeof GET_JOB_INSIGHTS; tabId: number }
  | { type: typeof GET_JOB_HISTORY; tabId: number; jobId: string };

export function createPageEvent(payload: JobInsights): PageEvent {
  return {
    source: PAGE_EVENT_SOURCE,
    version: PAGE_EVENT_VERSION,
    type: PAGE_EVENT_TYPE,
    payload,
  };
}

function isNullableFiniteNumber(value: unknown): value is number | null {
  return value === null || (typeof value === 'number' && Number.isFinite(value));
}

function isClientPayProfile(value: unknown): value is ClientPayProfile {
  if (typeof value !== 'object' || value === null) return false;
  const profile = value as Record<string, unknown>;
  return (
    isNullableFiniteNumber(profile.totalCharges) &&
    isNullableFiniteNumber(profile.averageHourlyRate) &&
    isNullableFiniteNumber(profile.medianRecentFixedPayment) &&
    isNullableFiniteNumber(profile.averageRecentFixedPayment) &&
    (profile.historicalHourlyRates === null ||
      (Array.isArray(profile.historicalHourlyRates) &&
        profile.historicalHourlyRates.every(
          (rate) => typeof rate === 'number' && Number.isFinite(rate) && rate > 0,
        )))
  );
}

export function isJobHistoryResponse(value: unknown): value is JobHistoryResponse {
  if (typeof value !== 'object' || value === null) return false;
  const response = value as Record<string, unknown>;
  if (typeof response.jobId !== 'string' || response.jobId.trim().length === 0) return false;
  if (!isNullableFiniteNumber(response.velocity) || !isClientPayProfile(response.payProfile)) {
    return false;
  }
  if (response.summary === null) return true;
  if (typeof response.summary !== 'object') return false;
  const summary = response.summary as Record<string, unknown>;
  const latestApplicants = summary.latestApplicants;
  const firstSeenApplicants = summary.firstSeenApplicants;
  return (
    typeof summary.snapshotCount === 'number' &&
    Number.isInteger(summary.snapshotCount) &&
    summary.snapshotCount >= 0 &&
    isNullableFiniteNumber(latestApplicants) &&
    (latestApplicants === null || latestApplicants >= 0) &&
    isNullableFiniteNumber(firstSeenApplicants) &&
    (firstSeenApplicants === null || firstSeenApplicants >= 0) &&
    isNullableFiniteNumber(summary.firstSeenDelta) &&
    isNullableFiniteNumber(summary.recentDelta)
  );
}

export function isPageEvent(value: unknown): value is PageEvent {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    event.source === PAGE_EVENT_SOURCE &&
    event.version === PAGE_EVENT_VERSION &&
    event.type === PAGE_EVENT_TYPE &&
    isJobInsights(event.payload)
  );
}

export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Record<string, unknown>;
  const validTabId =
    typeof message.tabId === 'number' && Number.isInteger(message.tabId) && message.tabId >= 0;
  if (message.type === STORE_JOB_INSIGHTS) {
    return isJobInsights(message.payload);
  }
  if (message.type === GET_JOB_HISTORY) {
    return validTabId && typeof message.jobId === 'string' && message.jobId.trim().length > 0;
  }
  return message.type === GET_JOB_INSIGHTS && validTabId;
}
