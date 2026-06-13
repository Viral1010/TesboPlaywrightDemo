import { test, expect } from '@playwright/test';

test.describe('Reload persistence – variant 8', () => {
  test('todos survive a page reload (localStorage persistence)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Durable item A');
    await input.press('Enter');
    await input.fill('Durable item B');
    await input.press('Enter');

    await page.reload();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await expect(page.locator('.todo-list li label')).toHaveText(['Durable item A', 'Durable item B']);
  });
});
