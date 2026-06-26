import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 14', () => {
  test('edits "Review securty audit" to "Review security audit"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review securty audit');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Review security audit');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review security audit']);
  });
});
