import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 5', () => {
  test('edits "Review PR asap" to "Review PR before EOD"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review PR asap');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Review PR before EOD');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review PR before EOD']);
  });
});
