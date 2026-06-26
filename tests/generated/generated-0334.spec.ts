import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 37', () => {
  test('edits "Confgure health checks" to "Configure health checks"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Confgure health checks');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Configure health checks');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Configure health checks']);
  });
});
