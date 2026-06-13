import { test, expect } from '@playwright/test';

test.describe('Filter active todos – variant 8', () => {
  test('shows only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('UI work');
    await input.press('Enter');
    await input.fill('API work');
    await input.press('Enter');
    await input.fill('DB work');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'DB work' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['UI work', 'API work']);
  });
});
