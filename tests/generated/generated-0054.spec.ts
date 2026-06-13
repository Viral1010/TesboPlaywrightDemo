import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – variant 4', () => {
  test('shows only completed todos in Completed filter view', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Backlog');
    await input.press('Enter');
    await input.fill('In progress');
    await input.press('Enter');
    await input.fill('Done');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Done' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Done']);
  });
});
