import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 41', () => {
  test('adds "Setup log aggregation system" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup log aggregation system');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup log aggregation system']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
