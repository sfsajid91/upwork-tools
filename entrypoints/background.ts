import { isJobInsights } from '../lib/insights';
import {
  GET_JOB_INSIGHTS,
  isRuntimeMessage,
  STORE_JOB_INSIGHTS,
} from '../lib/protocol';

const storageKey = (tabId: number) => `job-insights:${tabId}`;

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (!isRuntimeMessage(message)) return undefined;

    if (message.type === STORE_JOB_INSIGHTS) {
      const tabId = sender.tab?.id;
      if (tabId === undefined || !Number.isInteger(tabId) || tabId < 0) return undefined;
      await browser.storage.session.set({ [storageKey(tabId)]: message.payload });
      return undefined;
    }

    const stored = await browser.storage.session.get(storageKey(message.tabId));
    const payload = stored[storageKey(message.tabId)];
    return isJobInsights(payload) ? payload : null;
  });

  const clearTab = (tabId: number) => {
    void browser.storage.session.remove(storageKey(tabId));
  };

  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'loading') clearTab(tabId);
  });
  browser.tabs.onRemoved.addListener(clearTab);
});
