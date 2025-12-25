import type { Page } from '@playwright/test';
import type { ActionLogger } from '../src/utils/actionLogger';
import { expect, test } from './fixtures';

const shouldRunSamples = process.env.REPORTER_SAMPLES === '1';
const describeReporterSamples = shouldRunSamples ? test.describe : test.describe.skip;
const TODO_URL = '/todomvc';

describeReporterSamples('Reporter failure samples', () => {
  test.beforeEach(async ({ page, actionLogger }) => {
    await loadTodoMvc(page, actionLogger);
  });

  test('fails due to text mismatch assertion', async ({ page, actionLogger }) => {
    await addTodo(page, actionLogger, 'Reporter Example');
    const labels = page.locator('.todo-list li label');
    await actionLogger.record(page, {
      description: 'Expect a wrong todo text on purpose',
      locatorDescription: '.todo-list li label',
      locator: labels,
      action: async () => {
        await expect(labels).toHaveText(['Some other text']);
      },
      notes: 'Creates an assertion mismatch error for reporter testing',
      waitForVisible: false
    });
  });

  test('fails while waiting for a missing locator', async ({ page, actionLogger }) => {
    await actionLogger.record(page, {
      description: 'Wait for a toast element that never appears',
      locatorDescription: '.toast-success',
      action: async () => {
        await page.locator('.toast-success').waitFor({ state: 'visible', timeout: 2000 });
      },
      notes: 'Produces a TimeoutError because the locator does not exist',
      waitForVisible: false
    });
  });

  test('fails when clicking a hidden control', async ({ page, actionLogger }) => {
    const clearCompleted = page.getByRole('button', { name: 'Clear completed' });
    await actionLogger.record(page, {
      description: 'Attempt to click Clear completed without completed todos',
      locatorDescription: 'footer button Clear completed',
      locator: clearCompleted,
      action: async () => {
        await clearCompleted.click({ timeout: 2500 });
      },
      notes: 'Click waits for visibility and times out because button is hidden',
      waitForVisible: false
    });
  });

  test('fails by throwing an explicit error', async ({ page, actionLogger }) => {
    await addTodo(page, actionLogger, 'Will throw error');
    await actionLogger.record(page, {
      description: 'Throw an intentional runtime error',
      locatorDescription: 'N/A',
      action: async () => {
        throw new Error('Reporter sample: intentional failure for stack trace coverage');
      },
      notes: 'Emits a generic Error to validate reporter rendering',
      waitForVisible: false
    });
  });
});

async function loadTodoMvc(page: Page, actionLogger: ActionLogger): Promise<void> {
  await actionLogger.record(page, {
    description: 'Navigate to TodoMVC demo for reporter samples',
    locatorDescription: `page.goto('${TODO_URL}')`,
    action: async () => {
      await page.goto(TODO_URL);
      await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
    },
    notes: 'Ensures consistent start state for all sample failures'
  });
}

async function addTodo(page: Page, actionLogger: ActionLogger, text: string): Promise<void> {
  const input = page.getByPlaceholder('What needs to be done?');
  await actionLogger.record(page, {
    description: `Create todo "${text}" for reporter sample`,
    locatorDescription: 'input.new-todo',
    locator: input,
    action: async () => {
      await input.fill(text);
      await input.press('Enter');
    },
    notes: 'Adds a todo item to set up the failure scenario'
  });
}



