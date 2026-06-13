import { test, expect } from '@playwright/test';

test.describe('Filter active todos – variant 9', () => {
  test('shows only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Monday task');
    await input.press('Enter');
    await input.fill('Tuesday task');
    await input.press('Enter');
    await input.fill('Wednesday task');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Monday task' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Tuesday task', 'Wednesday task']);
  });
});
