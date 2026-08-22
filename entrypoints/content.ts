import { browser } from 'wxt/browser';
import { STORE_JOB_INSIGHTS, isPageEvent } from '../lib/protocol';

export default defineContentScript({
  matches: ['*://*.upwork.com/*'],
  runAt: 'document_start',
  world: 'ISOLATED',
  main() {
    window.addEventListener('message', (event: MessageEvent<unknown>) => {
      if (
        !(event instanceof MessageEvent) ||
        event.source !== window ||
        event.origin !== window.location.origin ||
        !isPageEvent(event.data)
      ) {
        return;
      }

      try {
        void browser.runtime
          .sendMessage({ type: STORE_JOB_INSIGHTS, payload: event.data.payload })
          .catch(() => undefined);
      } catch {
        // The extension context may have been invalidated.
      }
    });
  },
});
