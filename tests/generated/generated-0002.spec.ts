import { test, expect } from '@playwright/test';

test.describe('Add single todo – variant 2', () => {
  test('adds "Write unit tests for auth module" and verifies it appears in the list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write unit tests for auth module');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Write unit tests for auth module']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
