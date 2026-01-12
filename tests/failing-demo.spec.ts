import { expect, test } from './fixtures';

const TODO_URL = '/todomvc';
const TODO_PLACEHOLDER = 'What needs to be done?';

test('demo failure: counter mismatch when adding one todo', async ({ page, actionLogger }) => {
  await actionLogger.record(page, {
    description: 'Load TodoMVC for failing demo',
    locatorDescription: `page.goto('${TODO_URL}') request`,
    locator: page.locator('body'),
    action: async () => {
      await page.goto(TODO_URL);
      await expect(page.getByPlaceholder(TODO_PLACEHOLDER)).toBeVisible();
    },
    notes: 'Sets the baseline page state for the demo failure'
  });

  await actionLogger.record(page, {
    description: 'Add a single todo item',
    locatorDescription: `input.new-todo[placeholder="${TODO_PLACEHOLDER}"]`,
    locator: page.getByPlaceholder(TODO_PLACEHOLDER),
    action: async () => {
      await page.getByPlaceholder(TODO_PLACEHOLDER).fill('Demo item');
      await page.getByPlaceholder(TODO_PLACEHOLDER).press('Enter');
    },
    notes: 'Creates one todo so the footer counter should be 1'
  });

  // Intentional failing expectation so logs and artifacts can be reviewed.
  await expect(page.locator('.todo-count')).toContainText('0 items left');
});

test('demo failure: blank todo should not be accepted', async ({ page, actionLogger }) => {
  await actionLogger.record(page, {
    description: 'Load TodoMVC for blank entry test',
    locatorDescription: `page.goto('${TODO_URL}') request`,
    locator: page.locator('body'),
    action: async () => {
      await page.goto(TODO_URL);
      await expect(page.getByPlaceholder(TODO_PLACEHOLDER)).toBeVisible();
    },
    notes: 'Ensures the input is present before the invalid attempt'
  });

  await actionLogger.record(page, {
    description: 'Attempt to submit an empty todo',
    locatorDescription: `input.new-todo[placeholder="${TODO_PLACEHOLDER}"]`,
    locator: page.getByPlaceholder(TODO_PLACEHOLDER),
    action: async () => {
      await page.getByPlaceholder(TODO_PLACEHOLDER).press('Enter');
    },
    notes: 'Many apps ignore empty submissions; this step captures behavior'
  });

  // Intentional failing expectation so logs and artifacts can be reviewed.
  await expect(page.locator('.todo-list li')).toHaveCount(1);
});

