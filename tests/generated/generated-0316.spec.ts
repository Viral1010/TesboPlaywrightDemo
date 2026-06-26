import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 19', () => {
  test('edits "Analize metrics" to "Analyze metrics"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Analize metrics');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Analyze metrics');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Analyze metrics']);
  });
});
