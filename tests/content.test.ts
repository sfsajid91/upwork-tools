import { afterAll, describe, expect, mock, test } from 'bun:test';

type MessageListener = (event: unknown) => void;

const windowListeners: MessageListener[] = [];
const runtimeListeners: Array<(message: unknown) => unknown> = [];

const fakeWindow = {
  location: { origin: 'https://www.upwork.com', href: 'https://www.upwork.com/jobs/job-content' },
  origin: 'https://www.upwork.com',
  addEventListener(_type: string, listener: MessageListener) {
    windowListeners.push(listener);
  },
  postMessage(event: unknown) {
    void event;
  },
};

const fakeBrowser = {
  runtime: {
    id: 'upwork-tools-test',
    onMessage: {
      addListener(listener: (message: unknown) => unknown) {
        runtimeListeners.push(listener);
      },
    },
  },
};

mock.module('wxt/browser', () => ({ browser: fakeBrowser }));

const globals = globalThis as unknown as Record<string, unknown>;
const hadWindow = 'window' in globals;
const previousWindow = globals.window;
const hadDefineContentScript = 'defineContentScript' in globals;
const previousDefineContentScript = globals.defineContentScript;

globals.window = fakeWindow;
let contentMain: (() => void) | undefined;
globals.defineContentScript = (definition: { main: () => void }) => {
  contentMain = definition.main;
  return definition;
};

afterAll(() => {
  if (hadDefineContentScript) globals.defineContentScript = previousDefineContentScript;
  else delete globals.defineContentScript;
  if (hadWindow) globals.window = previousWindow;
  else delete globals.window;
});

describe('content script installation', () => {
  test('ignores duplicate injection into the same frame', async () => {
    await import(`../entrypoints/content.ts?test=${crypto.randomUUID()}`);
    expect(typeof contentMain).toBe('function');

    contentMain?.();
    contentMain?.();

    expect(windowListeners).toHaveLength(1);
    expect(runtimeListeners).toHaveLength(1);
  });
});
