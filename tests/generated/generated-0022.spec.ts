import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 22', () => {
  test('adds "Implement rate limiting on API endpoints" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement rate limiting on API endpoints');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement rate limiting on API endpoints']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
