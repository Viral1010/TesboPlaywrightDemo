import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 20', () => {
  test('adds "Review security vulnerability report" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review security vulnerability report');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review security vulnerability report']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
