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
      './reporters/tesbo-uploader',
      {
        apiKey: 'qyjklipdnchsngperpqvddpvmzskakik', // or set env TESBO_API_KEY instead
        apiKeyEnv: 'TESBO_API_KEY',
        baseUrl: 'http://64.227.168.54:8080/api',
        reportFile: 'test-results.json'
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
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});

