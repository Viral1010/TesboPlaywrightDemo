import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 35', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Region 1');
    await input.press('Enter');
    await input.fill('Region 2');
    await input.press('Enter');
    await input.fill('Region 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Region 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Region 2' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Region 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Region 1', 'Region 2', 'Region 3']);
  });
});
