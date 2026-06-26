import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 33', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Round 1');
    await input.press('Enter');
    await input.fill('Round 2');
    await input.press('Enter');
    await input.fill('Round 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Round 2' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Round 2']);
  });
});
