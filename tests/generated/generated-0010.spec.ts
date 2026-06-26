import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 10', () => {
  test('adds "Conduct peer code review session" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Conduct peer code review session');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Conduct peer code review session']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
