import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 45', () => {
  test('edits "Setup complinace audit" to "Setup compliance audit"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup complinace audit');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Setup compliance audit');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup compliance audit']);
  });
});
