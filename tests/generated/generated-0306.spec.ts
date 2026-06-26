import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 9', () => {
  test('edits "Prepare relase notes" to "Prepare release notes"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Prepare relase notes');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Prepare release notes');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Prepare release notes']);
  });
});
