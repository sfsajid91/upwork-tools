import { browser } from 'wxt/browser';
import {
  isPageEvent,
  isRuntimeReplayRequest,
  PAGE_EVENT_SOURCE,
  PAGE_EVENT_VERSION,
  REQUEST_CURRENT_JOB_INSIGHTS,
  STORE_JOB_INSIGHTS,
} from '../lib/protocol';

const REPLAY_TIMEOUT_MS = 500;
const MAX_PENDING_REPLAYS = 32;
const INSTALL_FLAG = '__UPWORK_TOOLS_CONTENT_SCRIPT__';

type ReplayTimer = NodeJS.Timeout;

type PendingReplay = {
  timer: ReplayTimer;
  resolve: (result: boolean) => void;
};

type ContentWindow = Window & { [INSTALL_FLAG]?: boolean };

export default defineContentScript({
  matches: ['*://*.upwork.com/*'],
  runAt: 'document_start',
  world: 'ISOLATED',
  main() {
    const frame = window as ContentWindow;
    if (frame[INSTALL_FLAG]) return;
    frame[INSTALL_FLAG] = true;

    const pending = new Map<string, PendingReplay>();

    const finish = (requestId: string, result: boolean): void => {
      const request = pending.get(requestId);
      if (!request) return;
      clearTimeout(request.timer);
      pending.delete(requestId);
      request.resolve(result);
    };

    window.addEventListener('message', (event: MessageEvent<unknown>) => {
      if (
        !(event instanceof MessageEvent) ||
        event.source !== window ||
        event.origin !== window.location.origin ||
        !isPageEvent(event.data)
      ) {
        return;
      }

      if (event.data.replay) {
        const requestId = event.data.replay.requestId;
        if (!pending.has(requestId)) return;
        try {
          void browser.runtime
            .sendMessage({
              type: STORE_JOB_INSIGHTS,
              payload: event.data.payload,
              replay: { capturedAt: event.data.replay.capturedAt },
            })
            .then(
              () => finish(requestId, true),
              () => finish(requestId, false),
            );
        } catch {
          finish(requestId, false);
        }
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

    browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
      if (!isRuntimeReplayRequest(message)) return undefined;
      const requestId = message.requestId;
      if (pending.has(requestId)) {
        sendResponse(false);
        return undefined;
      }
      while (pending.size >= MAX_PENDING_REPLAYS) {
        const oldest = pending.keys().next().value;
        if (typeof oldest !== 'string') break;
        finish(oldest, false);
      }

      const timer = setTimeout(() => finish(requestId, false), REPLAY_TIMEOUT_MS);
      pending.set(requestId, { timer, resolve: sendResponse });
      try {
        window.postMessage(
          {
            source: PAGE_EVENT_SOURCE,
            version: PAGE_EVENT_VERSION,
            type: REQUEST_CURRENT_JOB_INSIGHTS,
            requestId,
          },
          window.location.origin,
        );
      } catch {
        finish(requestId, false);
      }
      return true;
    });
  },
});
