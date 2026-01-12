import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: path.join(__dirname, 'tests'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'artifacts/html-report' }],
    ['json', {  outputFile: 'test-results.json' }],
    [
      './reporters/tesbo-uploader-v3',  // Uploads after run from json report
      {
        apiKey: 'jsywrknvhxfknsxkdbauuymmjbmqslsp', // Local API key for testing
        apiKeyEnv: 'TESBO_API_KEY',
        reportingPortalUrl: 'https://app.tesbo.io/api',  // Use HTTPS to avoid redirect/downgrade issues
        runTitle: process.env.TESBO_RUN_TITLE || 'Local Playwright Test Run'
      }
    ]
  ],
  use: {
    baseURL: 'https://demo.playwright.dev',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  outputDir: 'artifacts/test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

