import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – variant 7', () => {
  test('shows only completed todos in Completed filter view', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Login page');
    await input.press('Enter');
    await input.fill('Dashboard');
    await input.press('Enter');
    await input.fill('Settings');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Login page' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Login page']);
  });
});
