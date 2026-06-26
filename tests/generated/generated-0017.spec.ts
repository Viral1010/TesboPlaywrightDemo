import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 17', () => {
  test('adds "Implement dark mode feature" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement dark mode feature');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement dark mode feature']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
