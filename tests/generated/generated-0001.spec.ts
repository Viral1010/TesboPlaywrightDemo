import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 1', () => {
  test('adds "Learn Playwright end-to-end testing" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Learn Playwright end-to-end testing');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Learn Playwright end-to-end testing']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
