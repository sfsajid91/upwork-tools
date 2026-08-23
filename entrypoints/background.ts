import { appendJobSnapshotIfChanged, listJobSnapshots, openDatabase, putJob } from '../lib/database';
import { deriveApplicantMetrics } from '../lib/applicant-metrics';
import { summarizeJobSnapshots } from '../lib/history';
import { isJobInsights, type JobInsights } from '../lib/insights';
import { deriveClientPayProfile } from '../lib/pay-profile';
import {
  GET_JOB_HISTORY,
  isRuntimeMessage,
  STORE_JOB_INSIGHTS,
  type JobHistoryResponse,
} from '../lib/protocol';
import { calculateProposalVelocity } from '../lib/velocity';
import type { JobRecord, JobSnapshotRecord } from '../lib/storage';
const BADGE_COLOR = '#152d4f';
const CAPTURE_DEDUP_WINDOW_MS = 60_000;
const storageKey = (tabId: number) => `job-insights:${tabId}`;

type TabState = {
  generation: number;
  pending: Promise<void>;
  removed: boolean;
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

function isJobDetailsPage(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === 'upwork.com' || parsed.hostname.endsWith('.upwork.com')) &&
      /(?:^|\/)details\/[^/]+/.test(parsed.pathname)
    );
  } catch {
    return false;
  }
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
  const jobId = typeof insights.job.id === 'string' ? insights.job.id.trim() : '';
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
    await appendJobSnapshotIfChanged(
      snapshot,
      CAPTURE_DEDUP_WINDOW_MS,
      () => !state.removed && state.generation === generation,
    );
  } catch {
    // IndexedDB failures must not affect session-only capture.
  }
}
async function readJobHistory(tabId: number, jobId: string): Promise<JobHistoryResponse | null> {
  try {
    const database = await openDatabase();
    if (!database) return null;
    const snapshots = await listJobSnapshots(jobId);
    const summary = summarizeJobSnapshots(snapshots, jobId);
    const stored = await browser.storage.session.get(storageKey(tabId));
    const storedPayload = stored[storageKey(tabId)];
    const storedInsights = isJobInsights(storedPayload) ? storedPayload : null;
    const insights = storedInsights?.job.id?.trim() === jobId ? storedInsights : null;
    const payProfile = deriveClientPayProfile({
      client: insights?.client,
      history: insights?.history.recentJobs,
    });
    if (!summary) {
      return { jobId, summary: null, velocity: null, payProfile };
    }
    const metrics = deriveApplicantMetrics(summary.snapshots);
    const firstSeenApplicants =
      typeof summary.firstSeen?.applicants === 'number' &&
      Number.isFinite(summary.firstSeen.applicants) &&
      summary.firstSeen.applicants >= 0
        ? summary.firstSeen.applicants
        : null;
    return {
      jobId,
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


export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!isRuntimeMessage(message)) return undefined;

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
        const capturedAt = Date.now();
        try {
          await enqueueTabMutation(tabId, async () => {
            if (state.removed || state.generation !== generation) return;
            try {
              await browser.storage.session.set({ [storageKey(tabId)]: message.payload });
              if (state.removed || state.generation !== generation) return;
              await persistJobInsights(state, generation, message.payload, capturedAt);
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
      void enqueueTabMutation(message.tabId, () => readJobHistory(message.tabId, message.jobId.trim())).then(
        sendResponse,
        () => sendResponse(null),
      );
      return true;
    }

    void (async () => {
      try {
        const stored = await browser.storage.session.get(storageKey(message.tabId));
        const payload = stored[storageKey(message.tabId)];
        sendResponse(isJobInsights(payload) ? payload : null);
      } catch {
        sendResponse(null);
      }
    })();
    return true;
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      const generation = advanceTabGeneration(tabId);
      void enqueueTabMutation(tabId, async () => {
        if (getTabState(tabId).generation !== generation) return;
        try {
          await browser.storage.session.remove(storageKey(tabId));
        } catch {
          // Session storage failures must not affect navigation.
        }
        if (getTabState(tabId).generation === generation) {
          await setBadge(tabId, changeInfo.url, '');
        }
      }).catch(() => undefined);
    }
  });
  browser.tabs.onRemoved.addListener((tabId) => {
    const state = getTabState(tabId);
    const generation = advanceTabGeneration(tabId);
    const cleanup = enqueueTabMutation(tabId, async () => {
      if (!state.removed || state.generation !== generation) return;
      try {
        await browser.storage.session.remove(storageKey(tabId));
      } catch {
        // Session storage failures must not affect tab cleanup.
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

