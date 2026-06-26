import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 33', () => {
  test('adds "Optimize image loading performance" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Optimize image loading performance');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Optimize image loading performance']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
