import type { ApplicationState, JobInsights } from './insights';

/** Theme modes accepted by the local settings adapter. */
export type ThemeMode = 'system' | 'light' | 'dark';

/** Latest normalized insight kept per tab in browser.storage.session. */
export type SessionLatestSnapshot = JobInsights;

/** One append-only competition observation in IndexedDB. */
export interface JobSnapshotRecord {
  id?: number;
  jobId: string;
  applicants: number | null;
  interviewed: number | null;
  hired: number | null;
  positions: number | null;
  capturedAt: number;
}
/** Latest complete normalized capture retained by normalized job ID. */
export interface LatestJobCaptureRecord {
  jobId: string;
  capturedAt: number;
  insights: JobInsights;
}

/** Normalized job metadata retained alongside historical snapshots. */
export interface JobRecord {
  jobId: string;
  job: JobInsights['job'];
  client: JobInsights['client'];
  viewerMode?: JobInsights['viewerMode'];
}

/** User application state retained locally, keyed by job ID. */
export interface ApplicationRecord {
  jobId: string;
  state: ApplicationState | null;
  viewedAt: number | null;
  appliedAt: number | null;
  interviewedAt: number | null;
  hiredAt: number | null;
}

/** A locally saved job and its most recently observed snapshot. */
export interface WatchlistRecord {
  jobId: string;
  job: JobInsights['job'];
  latestSnapshotId: number | null;
  savedAt: number;
}

/** Small personal profile stored in browser.storage.local. */
export interface UserProfile {
  hourlyRate: number | null;
  skills: string[];
  preferences: Record<string, unknown>;
}

/** A portfolio item used for deterministic local matching. */
export interface PortfolioEntry {
  title: string;
  skills: string[];
  tags: string[];
  url: string | null;
}

/** Extension preferences stored in browser.storage.local. */
export interface UiSettings {
  theme: ThemeMode;
  features: Record<string, boolean>;
}

/** Storage.local keys owned by the local profile/settings boundary. */
export interface LocalStorageRecord {
  userProfile: UserProfile;
  portfolio: PortfolioEntry[];
  uiSettings: UiSettings;
}

/** Persistent history is bounded before IndexedDB persistence is enabled. */
export const HISTORY_RETENTION_DAYS = 90;
export const MAX_SNAPSHOTS_PER_JOB = 100;

/** Data groups covered by a user-visible clear-data operation. */
export const CLEARABLE_STORAGE_SCOPES = [
  'session',
  'history',
  'applications',
  'watchlist',
  'profile',
  'portfolio',
  'settings',
] as const;

export type ClearableStorageScope = (typeof CLEARABLE_STORAGE_SCOPES)[number];
