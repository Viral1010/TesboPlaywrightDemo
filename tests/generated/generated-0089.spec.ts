import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – variant 9', () => {
  test('clears 2 completed todo(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Submitted report');
    await input.press('Enter');
    await input.fill('Draft report');
    await input.press('Enter');
    await input.fill('Archive data');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Submitted report' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Archive data' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Draft report']);
  });
});
