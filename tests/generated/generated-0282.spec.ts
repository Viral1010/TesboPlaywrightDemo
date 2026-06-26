import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 34', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Day 1');
    await input.press('Enter');
    await input.fill('Day 2');
    await input.press('Enter');
    await input.fill('Day 3');
    await input.press('Enter');
    await input.fill('Day 4');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Day 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Day 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Day 1', 'Day 3']);
  });
});
