import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 8', () => {
  test('edits "Schedule meeing" to "Schedule team meeting"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Schedule meeing');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Schedule team meeting');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Schedule team meeting']);
  });
});
