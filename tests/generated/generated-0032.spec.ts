import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 32', () => {
  test('adds "Create admin dashboard interface" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create admin dashboard interface');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create admin dashboard interface']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
