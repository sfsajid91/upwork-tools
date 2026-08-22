import { STORE_JOB_INSIGHTS, isPageEvent } from '../lib/protocol';

export default defineContentScript({
  matches: ['*://*.upwork.com/*'],
  main() {
    window.addEventListener('message', (event: MessageEvent<unknown>) => {
      if (
        event.source !== window ||
        event.origin !== window.location.origin ||
        !isPageEvent(event.data)
      ) {
        return;
      }

      void browser.runtime
        .sendMessage({ type: STORE_JOB_INSIGHTS, payload: event.data.payload })
        .catch(() => undefined);
    });
  },
});
