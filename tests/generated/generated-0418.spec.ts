import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 22', () => {
  test('clears 3 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Done 1');
    await input.press('Enter');
    await input.fill('Pending 1');
    await input.press('Enter');
    await input.fill('Done 2');
    await input.press('Enter');
    await input.fill('Pending 2');
    await input.press('Enter');
    await input.fill('Done 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Done 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Done 2' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Done 3' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Pending 1', 'Pending 2']);
  });
});
