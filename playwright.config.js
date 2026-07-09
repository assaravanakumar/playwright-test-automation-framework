const { defineConfig, devices } = require('@playwright/test');

const UI_BASE_URL = process.env.UI_BASE_URL || 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5 * 1000 },

  // Parallel execution: each spec file runs in its own worker.
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,

  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ...(process.env.CI ? [['junit', { outputFile: 'test-results/junit.xml' }]] : []),
  ],

  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // saucedemo.com uses `data-test` instead of the Playwright default `data-testid`
    testIdAttribute: 'data-test',
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_BASE_URL },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: UI_BASE_URL },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'], baseURL: UI_BASE_URL },
    },
  ],
});
