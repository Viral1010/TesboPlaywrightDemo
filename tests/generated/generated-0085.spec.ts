import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – variant 5', () => {
  test('clears 2 completed todo(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Shipped feature');
    await input.press('Enter');
    await input.fill('In review');
    await input.press('Enter');
    await input.fill('Deployed hotfix');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Shipped feature' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Deployed hotfix' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['In review']);
  });
});
