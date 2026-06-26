import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 49', () => {
  test('adds "Setup metrics collection dashboard" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup metrics collection dashboard');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup metrics collection dashboard']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
