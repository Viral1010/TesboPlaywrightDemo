import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 48', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup usage analytics');
    await input.press('Enter');
    await input.fill('Track user behavior');
    await input.press('Enter');
    await input.fill('Create insights dashboard');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup usage analytics', 'Track user behavior', 'Create insights dashboard']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
