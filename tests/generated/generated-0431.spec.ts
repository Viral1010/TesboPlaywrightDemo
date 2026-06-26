import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 35', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Synced database');
    await input.press('Enter');
    await input.fill('Pending sync');
    await input.press('Enter');
    await input.fill('Backed up data');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Synced database' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Backed up data' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Pending sync']);
  });
});
