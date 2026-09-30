import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: 'browser.spec.ts',
  use: { headless: true, viewport: { width: 1280, height: 1000 } },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:4317',
      reuseExistingServer: true,
    },
    {
      command: 'astro dev --root examples/astro',
      url: 'http://127.0.0.1:4318',
      reuseExistingServer: true,
    },
  ],
  reporter: 'list',
});
