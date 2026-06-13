import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – variant 9', () => {
  test('shows only completed todos in Completed filter view', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Feature A');
    await input.press('Enter');
    await input.fill('Feature B');
    await input.press('Enter');
    await input.fill('Feature C');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Feature A' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Feature B' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Feature A', 'Feature B']);
  });
});
