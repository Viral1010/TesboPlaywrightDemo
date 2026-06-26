import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 36', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Executed query');
    await input.press('Enter');
    await input.fill('Pending query');
    await input.press('Enter');
    await input.fill('Executed report');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Executed query' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Executed report' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Pending query']);
  });
});
