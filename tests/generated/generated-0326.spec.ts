import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 29', () => {
  test('edits "Upgrade framwork version" to "Upgrade framework version"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Upgrade framwork version');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Upgrade framework version');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Upgrade framework version']);
  });
});
