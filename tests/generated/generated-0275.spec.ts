import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 27', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Target 1');
    await input.press('Enter');
    await input.fill('Target 2');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Target 1' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Target 1']);
  });
});
