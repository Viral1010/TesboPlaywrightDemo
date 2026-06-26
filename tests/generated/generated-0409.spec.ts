import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 13', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Finished X');
    await input.press('Enter');
    await input.fill('Active X');
    await input.press('Enter');
    await input.fill('Finished Y');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Finished X' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Finished Y' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Active X']);
  });
});
