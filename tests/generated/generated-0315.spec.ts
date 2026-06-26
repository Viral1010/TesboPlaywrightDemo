import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 18', () => {
  test('edits "Refaktor code" to "Refactor code"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Refaktor code');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Refactor code');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Refactor code']);
  });
});
