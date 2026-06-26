import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 11', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');
    await input.fill('Task 4');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Task 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Task 3' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Task 1', 'Task 3']);
  });
});
