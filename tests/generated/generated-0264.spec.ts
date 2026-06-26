import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 16', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Module 1');
    await input.press('Enter');
    await input.fill('Module 2');
    await input.press('Enter');
    await input.fill('Module 3');
    await input.press('Enter');
    await input.fill('Module 4');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Module 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Module 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Module 1', 'Module 3']);
  });
});
