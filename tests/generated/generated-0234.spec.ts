import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 35', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Round 1');
    await input.press('Enter');
    await input.fill('Round 2');
    await input.press('Enter');
    await input.fill('Round 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Round 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Round 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Round 2']);
  });
});
