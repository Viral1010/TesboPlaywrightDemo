import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 14', () => {
  test('adds "Debug memory leak in production" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Debug memory leak in production');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Debug memory leak in production']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
