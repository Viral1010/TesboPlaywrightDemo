import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 6', () => {
  test('adds "Deploy feature branch to staging" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Deploy feature branch to staging');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Deploy feature branch to staging']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
