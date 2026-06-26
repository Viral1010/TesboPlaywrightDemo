import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 11', () => {
  test('edits "Create API documenation" to "Create API documentation"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create API documenation');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Create API documentation');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create API documentation']);
  });
});
