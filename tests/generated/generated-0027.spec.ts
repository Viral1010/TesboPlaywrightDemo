import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 27', () => {
  test('adds "Setup load testing infrastructure" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup load testing infrastructure');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup load testing infrastructure']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
