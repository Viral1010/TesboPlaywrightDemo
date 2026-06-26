import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 2', () => {
  test('edits "Fix typo in readme" to "Fix typo in README.md"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Fix typo in readme');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Fix typo in README.md');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Fix typo in README.md']);
  });
});
