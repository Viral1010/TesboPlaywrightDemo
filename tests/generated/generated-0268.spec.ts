import { test, expect } from '@playwright/test';

test.describe('Filter completed todos – test 20', () => {
  test('displays only completed todos in Completed filter', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Node 1');
    await input.press('Enter');
    await input.fill('Node 2');
    await input.press('Enter');
    await input.fill('Node 3');
    await input.press('Enter');
    await input.fill('Node 4');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Node 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Node 3' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Node 4' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Node 1', 'Node 3', 'Node 4']);
  });
});
