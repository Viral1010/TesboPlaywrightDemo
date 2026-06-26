import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 20', () => {
  test('edits "Implmenet validation" to "Implement validation"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implmenet validation');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Implement validation');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement validation']);
  });
});
