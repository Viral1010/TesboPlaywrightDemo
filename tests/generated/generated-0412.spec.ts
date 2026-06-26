import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 16', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item A done');
    await input.press('Enter');
    await input.fill('Item B pending');
    await input.press('Enter');
    await input.fill('Item C done');
    await input.press('Enter');
    await input.fill('Item D pending');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Item A done' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Item C done' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Item B pending', 'Item D pending']);
  });
});
