import { expect, test } from './fixtures';

const TODO_URL = '/todomvc';
const TODO_PLACEHOLDER = 'What needs to be done?';

test(
  'long-running demo ~10s',
  { timeout: 20_000 },
  async ({ page, actionLogger }) => {
    await actionLogger.record(page, {
      description: 'Load TodoMVC for 10s demo',
      locatorDescription: `page.goto('${TODO_URL}') request`,
      locator: page.locator('body'),
      action: async () => {
        await page.goto(TODO_URL);
        await expect(page.getByPlaceholder(TODO_PLACEHOLDER)).toBeVisible();
      },
      notes: 'Baseline state before the deliberate wait'
    });

    await actionLogger.record(page, {
      description: 'Hold for ~10 seconds to simulate slow operation',
      locatorDescription: 'page.waitForTimeout(10_000)',
      locator: page.locator('body'),
      action: async () => {
        await page.waitForTimeout(10_000);
      },
      notes: 'Intentional pause to generate longer test duration'
    });
  }
);

test(
  'long-running demo ~60s',
  { timeout: 75_000 },
  async ({ page, actionLogger }) => {
    await actionLogger.record(page, {
      description: 'Load TodoMVC for 60s demo',
      locatorDescription: `page.goto('${TODO_URL}') request`,
      locator: page.locator('body'),
      action: async () => {
        await page.goto(TODO_URL);
        await expect(page.getByPlaceholder(TODO_PLACEHOLDER)).toBeVisible();
      },
      notes: 'Baseline state before the deliberate long wait'
    });

    await actionLogger.record(page, {
      description: 'Hold for ~60 seconds to simulate heavy workflow',
      locatorDescription: 'page.waitForTimeout(60_000)',
      locator: page.locator('body'),
      action: async () => {
        await page.waitForTimeout(60_000);
      },
      notes: 'Intentional long pause to observe logs, traces, and reporter UX'
    });
  }
);

