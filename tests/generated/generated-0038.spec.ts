import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 38', () => {
  test('adds "Create API documentation" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create API documentation');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create API documentation']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
