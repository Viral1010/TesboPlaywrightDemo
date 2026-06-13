import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – variant 7', () => {
  test('clears 1 completed todo(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Released v1');
    await input.press('Enter');
    await input.fill('Plan v2');
    await input.press('Enter');
    await input.fill('Fix regression');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Released v1' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Plan v2', 'Fix regression']);
  });
});
