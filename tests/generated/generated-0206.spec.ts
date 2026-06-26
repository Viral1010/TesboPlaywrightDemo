import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 7', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Draft spec');
    await input.press('Enter');
    await input.fill('Review spec');
    await input.press('Enter');
    await input.fill('Sign off');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Draft spec' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Review spec' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Sign off']);
  });
});
