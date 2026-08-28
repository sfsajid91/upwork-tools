import type { ConversionStats } from './conversion';
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
  conversion: ConversionStats;
}
export const PAGE_EVENT_SOURCE = 'upwork-tools';
export const PAGE_EVENT_VERSION = 1;
export const PAGE_EVENT_TYPE = 'JOB_DETAILS_RECEIVED';
export const REQUEST_CURRENT_JOB_INSIGHTS = 'REQUEST_CURRENT_JOB_INSIGHTS';
export const STORE_JOB_INSIGHTS = 'STORE_JOB_INSIGHTS';
export const GET_JOB_INSIGHTS = 'GET_JOB_INSIGHTS';
export const GET_JOB_HISTORY = 'GET_JOB_HISTORY';
export const REQUEST_JOB_INSIGHTS_REPLAY = 'REQUEST_JOB_INSIGHTS_REPLAY';

export interface PageReplay {
  requestId: string;
  capturedAt: number;
}

export interface PageReplayRequest {
  source: typeof PAGE_EVENT_SOURCE;
  version: typeof PAGE_EVENT_VERSION;
  type: typeof REQUEST_CURRENT_JOB_INSIGHTS;
  requestId: string;
}

export interface RuntimeReplayRequest {
  type: typeof REQUEST_JOB_INSIGHTS_REPLAY;
  tabId: number;
  requestId: string;
}

export interface PageEvent {
  source: typeof PAGE_EVENT_SOURCE;
  version: typeof PAGE_EVENT_VERSION;
  type: typeof PAGE_EVENT_TYPE;
  payload: JobInsights;
  replay?: PageReplay;
}

export type RuntimeMessage =
  | { type: typeof STORE_JOB_INSIGHTS; payload: JobInsights; replay?: { capturedAt: number } }
  | { type: typeof GET_JOB_INSIGHTS; tabId: number }
  | { type: typeof GET_JOB_HISTORY; tabId: number; jobId: string }
  | RuntimeReplayRequest;

export function createPageEvent(payload: JobInsights, replay?: PageReplay): PageEvent {
  return {
    source: PAGE_EVENT_SOURCE,
    version: PAGE_EVENT_VERSION,
    type: PAGE_EVENT_TYPE,
    payload,
    ...(replay ? { replay } : {}),
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
function isConversionStats(value: unknown): value is ConversionStats {
  if (typeof value !== 'object' || value === null) return false;
  const stats = value as Record<string, unknown>;
  const count = (candidate: unknown): candidate is number =>
    typeof candidate === 'number' && Number.isInteger(candidate) && candidate >= 0;
  const rate = (candidate: unknown): candidate is number | null =>
    candidate === null || (typeof candidate === 'number' && Number.isFinite(candidate));
  return (
    count(stats.applications) &&
    count(stats.interviews) &&
    count(stats.hires) &&
    rate(stats.applyToInterviewRate) &&
    count(stats.applyToInterviewDenominator) &&
    rate(stats.interviewToHireRate) &&
    count(stats.interviewToHireDenominator)
  );
}

export function isJobHistoryResponse(value: unknown): value is JobHistoryResponse {
  if (typeof value !== 'object' || value === null) return false;
  const response = value as Record<string, unknown>;
  if (typeof response.jobId !== 'string' || response.jobId.trim().length === 0) return false;
  if (!isNullableFiniteNumber(response.velocity) || !isClientPayProfile(response.payProfile)) {
    return false;
  }
  if (!isConversionStats(response.conversion)) return false;
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

function isReplay(value: unknown): value is PageReplay {
  if (typeof value !== 'object' || value === null) return false;
  const replay = value as Record<string, unknown>;
  return (
    typeof replay.requestId === 'string' &&
    replay.requestId.trim().length > 0 &&
    typeof replay.capturedAt === 'number' &&
    Number.isFinite(replay.capturedAt) &&
    replay.capturedAt >= 0
  );
}

function isOptionalReplay(value: unknown): value is PageReplay | undefined {
  return value === undefined || isReplay(value);
}

export function isPageReplayRequest(value: unknown): value is PageReplayRequest {
  if (typeof value !== 'object' || value === null) return false;
  const request = value as Record<string, unknown>;
  return (
    request.source === PAGE_EVENT_SOURCE &&
    request.version === PAGE_EVENT_VERSION &&
    request.type === REQUEST_CURRENT_JOB_INSIGHTS &&
    typeof request.requestId === 'string' &&
    request.requestId.trim().length > 0
  );
}

export function isRuntimeReplayRequest(value: unknown): value is RuntimeReplayRequest {
  if (typeof value !== 'object' || value === null) return false;
  const request = value as Record<string, unknown>;
  return (
    request.type === REQUEST_JOB_INSIGHTS_REPLAY &&
    typeof request.tabId === 'number' &&
    Number.isInteger(request.tabId) &&
    request.tabId >= 0 &&
    typeof request.requestId === 'string' &&
    request.requestId.trim().length > 0
  );
}

function isReplayStoreMetadata(value: unknown): value is { capturedAt: number } {
  if (typeof value !== 'object' || value === null) return false;
  const metadata = value as Record<string, unknown>;
  return (
    typeof metadata.capturedAt === 'number' &&
    Number.isFinite(metadata.capturedAt) &&
    metadata.capturedAt >= 0
  );
}

export function isPageEvent(value: unknown): value is PageEvent {
  if (typeof value !== 'object' || value === null) return false;
  const event = value as Record<string, unknown>;
  return (
    event.source === PAGE_EVENT_SOURCE &&
    event.version === PAGE_EVENT_VERSION &&
    event.type === PAGE_EVENT_TYPE &&
    isJobInsights(event.payload) &&
    isOptionalReplay(event.replay)
  );
}

export function isRuntimeMessage(value: unknown): value is RuntimeMessage {
  if (isRuntimeReplayRequest(value)) return true;
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Record<string, unknown>;
  const validTabId =
    typeof message.tabId === 'number' && Number.isInteger(message.tabId) && message.tabId >= 0;
  if (message.type === STORE_JOB_INSIGHTS) {
    return (
      isJobInsights(message.payload) &&
      (message.replay === undefined || isReplayStoreMetadata(message.replay))
    );
  }
  if (message.type === GET_JOB_HISTORY) {
    return validTabId && typeof message.jobId === 'string' && message.jobId.trim().length > 0;
  }
  return message.type === GET_JOB_INSIGHTS && validTabId;
}
