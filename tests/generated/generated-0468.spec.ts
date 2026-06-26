import { test, expect } from '@playwright/test';

test.describe('Reload persistence final – test 24', () => {
  test('verifies todos survive page reload (localStorage persistence) – final batch', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Long term storage');
    await input.press('Enter');

    await page.reload();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await expect(page.locator('.todo-list li label')).toHaveText(['Long term storage']);
  });
});
