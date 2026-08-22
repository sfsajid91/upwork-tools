import { isJobInsights, type JobInsights } from './insights';

export const PAGE_EVENT_SOURCE = 'upwork-tools';
export const PAGE_EVENT_VERSION = 1;
export const PAGE_EVENT_TYPE = 'JOB_DETAILS_RECEIVED';
export const STORE_JOB_INSIGHTS = 'STORE_JOB_INSIGHTS';
export const GET_JOB_INSIGHTS = 'GET_JOB_INSIGHTS';

export interface PageEvent {
  source: typeof PAGE_EVENT_SOURCE;
  version: typeof PAGE_EVENT_VERSION;
  type: typeof PAGE_EVENT_TYPE;
  payload: JobInsights;
}

export type RuntimeMessage =
  | { type: typeof STORE_JOB_INSIGHTS; payload: JobInsights }
  | { type: typeof GET_JOB_INSIGHTS; tabId: number };

export function createPageEvent(payload: JobInsights): PageEvent {
  return {
    source: PAGE_EVENT_SOURCE,
    version: PAGE_EVENT_VERSION,
    type: PAGE_EVENT_TYPE,
    payload,
  };
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
  if (message.type === STORE_JOB_INSIGHTS) {
    return isJobInsights(message.payload);
  }
  return (
    message.type === GET_JOB_INSIGHTS &&
    typeof message.tabId === 'number' &&
    Number.isInteger(message.tabId) &&
    message.tabId >= 0
  );
}
