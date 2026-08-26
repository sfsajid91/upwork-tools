import { deriveApplicantMetrics } from '../lib/applicant-metrics';
import {
  appendJobSnapshotIfChanged,
  getLatestJobCapture,
  listJobSnapshots,
  mergeApplication,
  openDatabase,
  putJob,
  putLatestJobCapture,
} from '../lib/database';
import { summarizeJobSnapshots } from '../lib/history';
import { isJobInsights, type JobInsights } from '../lib/insights';
import { jobIdFromPageUrl, normalizeJobId, isJobPage } from '../lib/job-page';
import { deriveClientPayProfile } from '../lib/pay-profile';
import {
  GET_JOB_HISTORY,
  isRuntimeMessage,
  REQUEST_JOB_INSIGHTS_REPLAY,
  type JobHistoryResponse,
  STORE_JOB_INSIGHTS,
} from '../lib/protocol';
import type { JobRecord, JobSnapshotRecord } from '../lib/storage';
import { createApplicationRecord, transitionApplicationRecord } from '../lib/tracker';
import { calculateProposalVelocity } from '../lib/velocity';

const BADGE_COLOR = '#152d4f';
const CAPTURE_DEDUP_WINDOW_MS = 60_000;
const storageKey = (tabId: number) => `job-insights:${tabId}`;
const metadataKey = (tabId: number) => `${storageKey(tabId)}:metadata`;

type TabState = {
  generation: number;
  pending: Promise<void>;
  removed: boolean;
};

type TabCaptureMetadata = {
  jobId: string;
  capturedAt: number;
};

const tabStates = new Map<number, TabState>();

function getTabState(tabId: number): TabState {
  let state = tabStates.get(tabId);
  if (!state || state.removed) {
    state = {
      generation: 0,
      pending: state?.removed ? state.pending : Promise.resolve(),
      removed: false,
    };
    tabStates.set(tabId, state);
  }
  return state;
}

function advanceTabGeneration(tabId: number): number {
  const state = getTabState(tabId);
  state.generation += 1;
  return state.generation;
}

function enqueueTabMutation<T>(tabId: number, mutation: () => Promise<T>): Promise<T> {
  const state = getTabState(tabId);
  const next = state.pending.then(mutation, mutation);
  state.pending = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}
function isValidCaptureMetadata(value: unknown): value is TabCaptureMetadata {
  if (typeof value !== 'object' || value === null) return false;
  const metadata = value as Record<string, unknown>;
  return (
    typeof metadata.jobId === 'string' &&
    normalizeJobId(metadata.jobId) === metadata.jobId &&
    typeof metadata.capturedAt === 'number' &&
    Number.isFinite(metadata.capturedAt) &&
    metadata.capturedAt >= 0
  );
}

function isJobDetailsPage(url: string | undefined): boolean {
  return isJobPage(url);
}

async function setBadge(tabId: number, url: string | undefined, text: string): Promise<void> {
  try {
    const visible = isJobDetailsPage(url);
    await browser.action.setBadgeText({ tabId, text: visible ? text : '' });
    if (visible && text) {
      await browser.action.setBadgeBackgroundColor({ tabId, color: BADGE_COLOR });
    }
  } catch {
    // Badge updates must not affect capture or popup reads.
  }
}

async function persistJobInsights(
  state: TabState,
  generation: number,
  insights: JobInsights,
  capturedAt: number,
): Promise<void> {
  const jobId = normalizeJobId(insights.job.id);
  if (!jobId || state.removed || state.generation !== generation) return;

  const job: JobRecord = {
    jobId,
    job: { ...insights.job, id: jobId },
    client: { ...insights.client },
  };
  const snapshot: JobSnapshotRecord = {
    jobId,
    applicants: insights.activity.exactProposals,
    interviewed: insights.activity.interviewed,
    hired: insights.activity.totalHired,
    positions: insights.activity.positionsToHire,
    capturedAt,
  };

  try {
    await putJob(job, () => !state.removed && state.generation === generation);
  } catch {
    // IndexedDB failures must not affect session-only capture.
  }
  if (state.removed || state.generation !== generation) return;
  try {
    await putLatestJobCapture({ jobId, capturedAt, insights });
  } catch {
    // IndexedDB failures must not affect session-only capture.
  }

  try {
    let application = transitionApplicationRecord(createApplicationRecord(jobId), {
      type: 'viewed',
      at: capturedAt,
    });
    const observedState = insights.fit.applicationState;
    if (observedState) {
      application = transitionApplicationRecord(application, {
        type: 'observed-state',
        state: observedState,
        at: capturedAt,
      });
    }
    await mergeApplication(application, () => !state.removed && state.generation === generation);
  } catch {
    // IndexedDB failures must not affect session-only capture.
  }
  if (state.removed || state.generation !== generation) return;
  try {
    await appendJobSnapshotIfChanged(
      snapshot,

      CAPTURE_DEDUP_WINDOW_MS,
      () => !state.removed && state.generation === generation,
    );
  } catch {
    // IndexedDB failures must not affect session-only capture.
  }
}
async function currentTabJobId(tabId: number): Promise<string | null> {
  try {
    const tab = await browser.tabs.get(tabId);
    return jobIdFromPageUrl(tab.url);
  } catch {
    return null;
  }
}

async function readVerifiedSession(
  tabId: number,
  currentJobId: string,
): Promise<JobInsights | null> {
  try {
    const stored = await browser.storage.session.get([storageKey(tabId), metadataKey(tabId)]);
    const payload = stored[storageKey(tabId)];
    const metadata = stored[metadataKey(tabId)];
    if (
      !isJobInsights(payload) ||
      !isValidCaptureMetadata(metadata) ||
      metadata.jobId !== currentJobId
    ) {
      return null;
    }
    const payloadJobId = normalizeJobId(payload.job.id);
    if (payloadJobId !== null && payloadJobId !== currentJobId) return null;
    return payload;
  } catch {
    return null;
  }
}
async function restoreBadge(tabId: number, url?: string): Promise<void> {
  let currentUrl = url;
  if (!currentUrl) {
    try {
      currentUrl = (await browser.tabs.get(tabId)).url;
    } catch {
      await setBadge(tabId, undefined, '');
      return;
    }
  }

  const jobId = jobIdFromPageUrl(currentUrl);
  if (!jobId) {
    await setBadge(tabId, currentUrl, '');
    return;
  }

  const insights = await readVerifiedSession(tabId, jobId);
  if (insights) {
    await setBadge(tabId, currentUrl, String(insights.activity.exactProposals ?? ''));
    return;
  }

  try {
    const capture = await getLatestJobCapture(jobId);
    const hasMatchingCapture =
      capture !== null && normalizeJobId(capture.insights.job.id) === jobId;
    await setBadge(
      tabId,
      currentUrl,
      hasMatchingCapture ? String(capture.insights.activity.exactProposals ?? '') : '',
    );
  } catch {
    await setBadge(tabId, currentUrl, '');
  }
}

async function readJobHistory(tabId: number, jobId: string): Promise<JobHistoryResponse | null> {
  try {
    const normalizedJobId = normalizeJobId(jobId);
    if (!normalizedJobId || (await currentTabJobId(tabId)) !== normalizedJobId) return null;
    const database = await openDatabase();
    if (!database) return null;
    const snapshots = await listJobSnapshots(normalizedJobId);
    const summary = summarizeJobSnapshots(snapshots, normalizedJobId);
    const insights = await readVerifiedSession(tabId, normalizedJobId);
    const payProfile = deriveClientPayProfile({
      client: insights?.client,
      history: insights?.history.recentJobs,
    });
    if (!summary) {
      return { jobId: normalizedJobId, summary: null, velocity: null, payProfile };
    }
    const metrics = deriveApplicantMetrics(summary.snapshots);
    const firstSeenApplicants =
      typeof summary.firstSeen?.applicants === 'number' &&
      Number.isFinite(summary.firstSeen.applicants) &&
      summary.firstSeen.applicants >= 0
        ? summary.firstSeen.applicants
        : null;
    return {
      jobId: normalizedJobId,
      summary: {
        snapshotCount: summary.snapshots.length,
        latestApplicants: metrics.latestApplicantCount,
        firstSeenApplicants,
        firstSeenDelta: metrics.firstSeenDelta,
        recentDelta: metrics.recentDelta,
      },
      velocity: calculateProposalVelocity(
        summary.previous?.applicants,
        summary.latest?.applicants,
        summary.previous?.capturedAt,
        summary.latest?.capturedAt,
      ),
      payProfile,
    };
  } catch {
    return null;
  }
}

async function readJobInsights(tabId: number): Promise<JobInsights | null> {
  let currentUrl: string | undefined;
  let currentJobId: string | null = null;
  try {
    const tab = await browser.tabs.get(tabId);
    currentUrl = tab.url;
    currentJobId = jobIdFromPageUrl(tab.url);
  } catch {
    return null;
  }
  if (!currentJobId) return null;

  let insights = await readVerifiedSession(tabId, currentJobId);
  if (insights) return insights;

  try {
    await browser.tabs.sendMessage(tabId, {
      type: REQUEST_JOB_INSIGHTS_REPLAY,
      tabId,
      requestId: crypto.randomUUID(),
    });
  } catch {
    // The content script may be absent or the tab may have navigated.
  }

  insights = await readVerifiedSession(tabId, currentJobId);
  if (insights) return insights;

  const capture = await getLatestJobCapture(currentJobId);
  if (!capture || normalizeJobId(capture.insights.job.id) !== currentJobId) return null;
  try {
    await browser.storage.session.set({
      [storageKey(tabId)]: capture.insights,
      [metadataKey(tabId)]: { jobId: currentJobId, capturedAt: capture.capturedAt },
    });
    await setBadge(tabId, currentUrl, String(capture.insights.activity.exactProposals ?? ''));
    return capture.insights;
  } catch {
    return null;
  }
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!isRuntimeMessage(message)) return undefined;
    if (message.type === REQUEST_JOB_INSIGHTS_REPLAY) return undefined;

    if (message.type === STORE_JOB_INSIGHTS) {
      void (async () => {
        const tabId = sender.tab?.id;
        if (tabId === undefined || !Number.isInteger(tabId) || tabId < 0) {
          sendResponse();
          return;
        }
        const state = getTabState(tabId);
        if (state.removed) {
          sendResponse();
          return;
        }
        const generation = state.generation;
        const capturedAt = message.replay?.capturedAt ?? Date.now();
        const payloadJobId = normalizeJobId(message.payload.job.id);
        const currentJobId = jobIdFromPageUrl(sender.tab?.url);
        const identityConflict =
          payloadJobId !== null && currentJobId !== null && payloadJobId !== currentJobId;
        try {
          await enqueueTabMutation(tabId, async () => {
            if (state.removed || state.generation !== generation || identityConflict) return;
            const metadataJobId = payloadJobId ?? currentJobId;
            const metadata = metadataJobId ? { jobId: metadataJobId, capturedAt } : undefined;
            try {
              await browser.storage.session.set({
                [storageKey(tabId)]: message.payload,
                ...(metadata ? { [metadataKey(tabId)]: metadata } : {}),
              });
              if (!metadata) await browser.storage.session.remove(metadataKey(tabId));
              if (state.removed || state.generation !== generation) return;
              if (!message.replay) {
                await persistJobInsights(state, generation, message.payload, capturedAt);
              }
              await setBadge(
                tabId,
                sender.tab?.url,
                String(message.payload.activity.exactProposals ?? ''),
              );
            } catch {
              // Session storage failures must not affect the host page.
            }
          });
        } catch {
          // Session storage failures must not affect the host page.
        }
        sendResponse();
      })();
      return true;
    }

    if (message.type === GET_JOB_HISTORY) {
      void enqueueTabMutation(message.tabId, () =>
        readJobHistory(message.tabId, message.jobId),
      ).then(sendResponse, () => sendResponse(null));
      return true;
    }

    void readJobInsights(message.tabId).then(sendResponse, () => sendResponse(null));
    return true;
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      const generation = advanceTabGeneration(tabId);
      void enqueueTabMutation(tabId, async () => {
        if (getTabState(tabId).generation !== generation) return;
        await restoreBadge(tabId, changeInfo.url);
      }).catch(() => undefined);
    }
  });
  browser.tabs.onRemoved.addListener((tabId) => {
    const state = getTabState(tabId);
    const generation = advanceTabGeneration(tabId);
    const cleanup = enqueueTabMutation(tabId, async () => {
      if (!state.removed || state.generation !== generation) return;
      try {
        await browser.storage.session.remove([storageKey(tabId), metadataKey(tabId)]);
      } catch {
        // Session storage must not affect tab cleanup.
      }
      if (state.removed && state.generation === generation) {
        await setBadge(tabId, undefined, '');
      }
    });
    state.removed = true;
    void cleanup.then(
      () => {
        if (tabStates.get(tabId) === state && state.generation === generation) {
          tabStates.delete(tabId);
        }
      },
      () => undefined,
    );
  });
});
