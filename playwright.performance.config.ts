import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: [
    'performance.spec.ts',
    'recipes.browser.spec.ts',
    'workflows.browser.spec.ts',
    'controls.browser.spec.ts',
    'composition.browser.spec.ts',
    'eyedropper.browser.spec.ts',
    'documentation-versions.browser.spec.ts',
    'providers.browser.spec.ts',
  ],
  workers: 1,
  use: {
    headless: true,
    launchOptions: {
      args: ['--js-flags=--expose-gc', '--enable-precise-memory-info'],
    },
    viewport: { width: 1280, height: 1000 },
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:4317',
      reuseExistingServer: true,
    },
    ...(!process.env.SALYRA_DEMO_URL
      ? [
          {
            command:
              'npm run build:site && npm exec vite preview -- --host 127.0.0.1 --port 4321',
            url: 'http://127.0.0.1:4321',
            reuseExistingServer: true,
            timeout: 180000,
          },
        ]
      : []),
  ],
  reporter: [
    ['list'],
    ['json', { outputFile: 'artifacts/performance/browser.json' }],
  ],
});
