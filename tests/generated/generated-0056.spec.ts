import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 7', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Set up database schema');
    await input.press('Enter');
    await input.fill('Write migration script');
    await input.press('Enter');
    await input.fill('Test rollback path');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Set up database schema', 'Write migration script', 'Test rollback path']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
