import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 11', () => {
  test('adds "Optimize database query performance" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Optimize database query performance');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Optimize database query performance']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
