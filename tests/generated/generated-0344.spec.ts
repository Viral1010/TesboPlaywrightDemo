import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 47', () => {
  test('edits "Confgure role permision" to "Configure role permission"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Confgure role permision');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Configure role permission');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Configure role permission']);
  });
});
