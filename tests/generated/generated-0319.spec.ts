import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 22', () => {
  test('edits "Setup continuos deployment" to "Setup continuous deployment"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup continuos deployment');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Setup continuous deployment');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup continuous deployment']);
  });
});
