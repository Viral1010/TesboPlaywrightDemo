import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 30', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Target 1');
    await input.press('Enter');
    await input.fill('Target 2');
    await input.press('Enter');
    await input.fill('Target 3');
    await input.press('Enter');
    await input.fill('Target 4');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Target 2' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Target 4' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Target 1', 'Target 3']);
  });
});
