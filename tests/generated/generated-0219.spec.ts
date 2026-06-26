import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 20', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Service 1');
    await input.press('Enter');
    await input.fill('Service 2');
    await input.press('Enter');
    await input.fill('Service 3');
    await input.press('Enter');
    await input.fill('Service 4');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Service 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Service 2' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Service 3', 'Service 4']);
  });
});
