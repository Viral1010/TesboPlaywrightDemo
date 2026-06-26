import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 18', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Finished step 1');
    await input.press('Enter');
    await input.fill('Active step 1');
    await input.press('Enter');
    await input.fill('Finished step 2');
    await input.press('Enter');
    await input.fill('Active step 2');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Finished step 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Finished step 2' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Active step 1', 'Active step 2']);
  });
});
