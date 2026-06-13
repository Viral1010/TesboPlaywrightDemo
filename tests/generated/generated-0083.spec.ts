import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – variant 3', () => {
  test('clears 2 completed todo(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Old bug fix');
    await input.press('Enter');
    await input.fill('New feature');
    await input.press('Enter');
    await input.fill('Closed ticket');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Old bug fix' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Closed ticket' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['New feature']);
  });
});
