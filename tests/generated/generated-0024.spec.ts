import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 24', () => {
  test('adds "Write database migration scripts" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write database migration scripts');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Write database migration scripts']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
