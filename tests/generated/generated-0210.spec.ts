import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 11', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item A');
    await input.press('Enter');
    await input.fill('Item B');
    await input.press('Enter');
    await input.fill('Item C');
    await input.press('Enter');
    await input.fill('Item D');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Item B' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Item D' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Item A', 'Item C']);
  });
});
