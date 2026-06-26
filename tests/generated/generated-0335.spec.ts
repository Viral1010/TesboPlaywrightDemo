import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 38', () => {
  test('edits "Setup metric dashbord" to "Setup metric dashboard"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup metric dashbord');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Setup metric dashboard');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup metric dashboard']);
  });
});
