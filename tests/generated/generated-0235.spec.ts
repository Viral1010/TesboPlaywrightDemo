import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 36', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Entry 1');
    await input.press('Enter');
    await input.fill('Entry 2');
    await input.press('Enter');
    await input.fill('Entry 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Entry 2' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Entry 1', 'Entry 3']);
  });
});
