import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 25', () => {
  test('adds "Implement two-factor authentication" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement two-factor authentication');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement two-factor authentication']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
