import { test, expect } from '@playwright/test';

test.describe('Reload persistence – variant 6', () => {
  test('todos survive a page reload (localStorage persistence)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Reload check 1');
    await input.press('Enter');
    await input.fill('Reload check 2');
    await input.press('Enter');
    await input.fill('Reload check 3');
    await input.press('Enter');

    await page.reload();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await expect(page.locator('.todo-list li label')).toHaveText(['Reload check 1', 'Reload check 2', 'Reload check 3']);
  });
});
