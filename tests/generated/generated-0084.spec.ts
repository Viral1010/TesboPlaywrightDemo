import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – variant 4', () => {
  test('clears 2 completed todo(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Merged PR');
    await input.press('Enter');
    await input.fill('Open issue');
    await input.press('Enter');
    await input.fill('Closed issue');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Merged PR' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Closed issue' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Open issue']);
  });
});
