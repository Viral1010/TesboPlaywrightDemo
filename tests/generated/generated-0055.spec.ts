import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – variant 5', () => {
  test('shows only completed todos in Completed filter view', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Draft');
    await input.press('Enter');
    await input.fill('Review');
    await input.press('Enter');
    await input.fill('Published');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Draft' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Review' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Draft', 'Review']);
  });
});
