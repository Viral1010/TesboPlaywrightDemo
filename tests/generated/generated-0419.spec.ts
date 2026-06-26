import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 23', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Completed action');
    await input.press('Enter');
    await input.fill('Pending action');
    await input.press('Enter');
    await input.fill('Completed review');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Completed action' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Completed review' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Pending action']);
  });
});
