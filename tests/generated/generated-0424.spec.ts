import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 28', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Shipped code');
    await input.press('Enter');
    await input.fill('Under review code');
    await input.press('Enter');
    await input.fill('Shipped tests');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Shipped code' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Shipped tests' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Under review code']);
  });
});
