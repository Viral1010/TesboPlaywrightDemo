import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 16', () => {
  test('adds "Migrate legacy code to TypeScript" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Migrate legacy code to TypeScript');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Migrate legacy code to TypeScript']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
