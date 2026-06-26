import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 13', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Process A');
    await input.press('Enter');
    await input.fill('Process B');
    await input.press('Enter');
    await input.fill('Process C');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Process A' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Process A']);
  });
});
