import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 27', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Metric A');
    await input.press('Enter');
    await input.fill('Metric B');
    await input.press('Enter');
    await input.fill('Metric C');
    await input.press('Enter');
    await input.fill('Metric D');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Metric B' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Metric D' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Metric A', 'Metric C']);
  });
});
