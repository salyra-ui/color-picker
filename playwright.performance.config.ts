import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: ['performance.spec.ts', 'recipes.browser.spec.ts'],
  workers: 1,
  use: {
    headless: true,
    launchOptions: {
      args: ['--js-flags=--expose-gc', '--enable-precise-memory-info'],
    },
    viewport: { width: 1280, height: 1000 },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:4317',
    reuseExistingServer: true,
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'artifacts/performance/browser.json' }],
  ],
});
