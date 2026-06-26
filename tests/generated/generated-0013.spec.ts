import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 13', () => {
  test('adds "Create comprehensive test coverage report" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create comprehensive test coverage report');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create comprehensive test coverage report']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
