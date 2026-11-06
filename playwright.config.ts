import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    channel: 'chrome',
    headless: true
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    }
  ],
  webServer: {
    command: 'npm run start -- -p 3000',
    port: 3000,
    reuseExistingServer: true,
    timeout: 30 * 1000,
    env: {
      NEXT_PUBLIC_USE_MOCK_FALLBACK: 'false'
    }
  }
});
