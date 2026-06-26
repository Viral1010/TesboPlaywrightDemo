import { test, expect } from '@playwright/test';

test.describe('Inline edit todo – variant 30', () => {
  test('edits "Write performance benchmarks" to "Write performance benchmarks v2"', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write performance benchmarks');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('Write performance benchmarks v2');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Write performance benchmarks v2']);
  });
});
