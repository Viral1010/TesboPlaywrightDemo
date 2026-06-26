import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 42', () => {
  test('adds "Implement real-time notifications" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement real-time notifications');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement real-time notifications']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
