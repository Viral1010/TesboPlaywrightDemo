import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 42', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review 1');
    await input.press('Enter');
    await input.fill('Review 2');
    await input.press('Enter');
    await input.fill('Review 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Review 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Review 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Review 2']);
  });
});
