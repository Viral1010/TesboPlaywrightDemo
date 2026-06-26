import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 18', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item X');
    await input.press('Enter');
    await input.fill('Item Y');
    await input.press('Enter');
    await input.fill('Item Z');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Item Y' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Item Y']);
  });
});
