import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 43', () => {
  test('adds "Create data migration tool" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create data migration tool');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create data migration tool']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
