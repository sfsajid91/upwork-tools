import { appendJobSnapshotIfChanged, putJob } from '../lib/database';
import { isJobInsights, type JobInsights } from '../lib/insights';
import { isRuntimeMessage, STORE_JOB_INSIGHTS } from '../lib/protocol';
import type { JobRecord, JobSnapshotRecord } from '../lib/storage';

const BADGE_COLOR = '#152d4f';
const CAPTURE_DEDUP_WINDOW_MS = 60_000;
const storageKey = (tabId: number) => `job-insights:${tabId}`;

type TabState = {
  generation: number;
  pending: Promise<void>;
};

const tabStates = new Map<number, TabState>();

function getTabState(tabId: number): TabState {
  let state = tabStates.get(tabId);
  if (!state) {
    state = { generation: 0, pending: Promise.resolve() };
    tabStates.set(tabId, state);
  }
  return state;
}

function advanceTabGeneration(tabId: number): number {
  const state = getTabState(tabId);
  state.generation += 1;
  return state.generation;
}

function enqueueTabMutation(tabId: number, mutation: () => Promise<void>): Promise<void> {
  const state = getTabState(tabId);
  const next = state.pending.then(mutation, mutation);
  state.pending = next.catch(() => undefined);
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
  if (!jobId || state.generation !== generation) return;

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
    await putJob(job, () => state.generation === generation);
  } catch {
    // IndexedDB failures must not affect session-only capture.
  }
  if (state.generation !== generation) return;
  try {
    await appendJobSnapshotIfChanged(
      snapshot,
      CAPTURE_DEDUP_WINDOW_MS,
      () => state.generation === generation,
    );
  } catch {
    // IndexedDB failures must not affect session-only capture.
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
        const generation = state.generation;
        const capturedAt = Date.now();
        try {
          await enqueueTabMutation(tabId, async () => {
            if (state.generation !== generation) return;
            try {
              await browser.storage.session.set({ [storageKey(tabId)]: message.payload });
              if (state.generation !== generation) return;
              void persistJobInsights(state, generation, message.payload, capturedAt);
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
    const generation = advanceTabGeneration(tabId);
    void enqueueTabMutation(tabId, async () => {
      if (getTabState(tabId).generation !== generation) return;
      try {
        await browser.storage.session.remove(storageKey(tabId));
      } catch {
        // Session storage failures must not affect tab cleanup.
      }
      if (getTabState(tabId).generation === generation) {
        await setBadge(tabId, undefined, '');
      }
    }).then(
      () => {
        if (tabStates.get(tabId)?.generation === generation) {
          tabStates.delete(tabId);
        }
      },
      () => undefined,
    );
  });
});

