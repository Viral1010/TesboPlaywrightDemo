import { test, expect } from '@playwright/test';

test.describe('Filter active todos – variant 5', () => {
  test('shows only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Meeting prep');
    await input.press('Enter');
    await input.fill('Follow up');
    await input.press('Enter');
    await input.fill('Send agenda');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Send agenda' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Meeting prep', 'Follow up']);
  });
});
