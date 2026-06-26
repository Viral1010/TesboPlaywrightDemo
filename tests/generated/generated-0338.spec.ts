import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 41', () => {
  test('edits "Setup request tracing" to "Setup request tracing v2"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup request tracing');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Setup request tracing v2');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup request tracing v2']);
  });
});
