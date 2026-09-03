import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: 'Upwork Tools',
    description: 'Shows locally captured Upwork job insights for the active tab.',
    minimum_chrome_version: '111',
    permissions: ['storage'],
    host_permissions: ['*://*.upwork.com/*'],
  },
});
