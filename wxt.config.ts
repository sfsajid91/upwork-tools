import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  suppressWarnings: {
    firefoxDataCollection: true,
  },
  manifest: {
    name: 'Upwork Tools',
    description: 'Shows locally captured Upwork job insights for the active tab.',
    minimum_chrome_version: '111',
    permissions: ['storage'],
    host_permissions: ['*://*.upwork.com/*'],
    browser_specific_settings: {
      gecko: {
        id: 'upwork-tools@local',
        strict_min_version: '120.0',
      },
    },
  },
});
