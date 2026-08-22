import { isJobInsights } from '../lib/insights';
import { isRuntimeMessage, STORE_JOB_INSIGHTS } from '../lib/protocol';

const BADGE_COLOR = '#152d4f';
const storageKey = (tabId: number) => `job-insights:${tabId}`;

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

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (!isRuntimeMessage(message)) return undefined;

    if (message.type === STORE_JOB_INSIGHTS) {
      const tabId = sender.tab?.id;
      if (tabId === undefined || !Number.isInteger(tabId) || tabId < 0) return undefined;
      try {
        await browser.storage.session.set({ [storageKey(tabId)]: message.payload });
        await setBadge(
          tabId,
          sender.tab?.url,
          String(message.payload.activity.exactProposals ?? ''),
        );
      } catch {
        // Session storage failures must not affect the host page.
      }
      return undefined;
    }

    try {
      const stored = await browser.storage.session.get(storageKey(message.tabId));
      const payload = stored[storageKey(message.tabId)];
      return isJobInsights(payload) ? payload : null;
    } catch {
      return null;
    }
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') {
      void browser.storage.session.remove(storageKey(tabId)).catch(() => undefined);
      void setBadge(tabId, changeInfo.url, '');
    }
  });
  browser.tabs.onRemoved.addListener((tabId) => {
    void browser.storage.session.remove(storageKey(tabId)).catch(() => undefined);
    void setBadge(tabId, undefined, '');
  });
});
