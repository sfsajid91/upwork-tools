import { installInterceptors } from '../lib/interceptor';

export default defineContentScript({
  matches: ['*://*.upwork.com/*'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    installInterceptors();
  },
});
