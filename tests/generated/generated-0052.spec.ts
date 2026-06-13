import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – variant 2', () => {
  test('shows only completed todos in Completed filter view', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item 1');
    await input.press('Enter');
    await input.fill('Item 2');
    await input.press('Enter');
    await input.fill('Item 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Item 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Item 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Item 1', 'Item 3']);
  });
});
