import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 45', () => {
  test('adds "Setup compliance audit trail" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup compliance audit trail');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup compliance audit trail']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
