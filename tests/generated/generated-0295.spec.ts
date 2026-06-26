import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 47', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Link 1');
    await input.press('Enter');
    await input.fill('Link 2');
    await input.press('Enter');
    await input.fill('Link 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Link 2' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Link 2']);
  });
});
