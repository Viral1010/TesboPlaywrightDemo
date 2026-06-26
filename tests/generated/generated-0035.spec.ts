import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 35', () => {
  test('adds "Implement customer analytics tracking" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement customer analytics tracking');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement customer analytics tracking']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
