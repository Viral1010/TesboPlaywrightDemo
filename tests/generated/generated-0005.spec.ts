import { test, expect } from '@playwright/test';

test.describe('Add single todo – variant 5', () => {
  test('adds "Update API documentation" and verifies it appears in the list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Update API documentation');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Update API documentation']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
