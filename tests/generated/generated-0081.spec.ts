import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – variant 1', () => {
  test('clears 1 completed todo(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Done task');
    await input.press('Enter');
    await input.fill('Active task');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Done task' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Active task']);
  });
});
