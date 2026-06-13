import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – variant 6', () => {
  test('shows only completed todos in Completed filter view', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Step 1');
    await input.press('Enter');
    await input.fill('Step 2');
    await input.press('Enter');
    await input.fill('Step 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Step 2' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Step 2']);
  });
});
