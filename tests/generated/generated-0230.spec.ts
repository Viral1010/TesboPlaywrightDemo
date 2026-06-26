import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 31', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Day 1');
    await input.press('Enter');
    await input.fill('Day 2');
    await input.press('Enter');
    await input.fill('Day 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Day 2' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Day 1', 'Day 3']);
  });
});
