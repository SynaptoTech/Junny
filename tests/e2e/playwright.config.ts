import { defineConfig, devices } from '@playwright/test';

/**
 * E2E against the Angular dev server (default MD15 ports).
 * Opt-in: `E2E=1 npm run test:e2e` (requires `npx playwright install chromium` once).
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:20052';
const e2eEnabled = process.env.E2E === '1';

export default defineConfig({
  testDir: './specs',
  /** Avoid launching Chromium in default `npm test`; enable with E2E=1. */
  ...(e2eEnabled ? {} : { testIgnore: ['**/*'] }),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
