import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 12', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Feature X');
    await input.press('Enter');
    await input.fill('Feature Y');
    await input.press('Enter');
    await input.fill('Feature Z');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Feature Y' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Feature X', 'Feature Z']);
  });
});
