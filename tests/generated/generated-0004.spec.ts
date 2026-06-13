import { test, expect } from '@playwright/test';

test.describe('Add single todo – variant 4', () => {
  test('adds "Fix critical bug in checkout flow" and verifies it appears in the list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Fix critical bug in checkout flow');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Fix critical bug in checkout flow']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
