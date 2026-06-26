import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 50', () => {
  test('edits "Implmenet data encription" to "Implement data encryption"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implmenet data encription');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Implement data encryption');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement data encryption']);
  });
});
