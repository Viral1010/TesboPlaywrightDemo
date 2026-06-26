import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 41', () => {
  test('deletes "Item gamma" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item alpha');
    await input.press('Enter');
    await input.fill('Item beta');
    await input.press('Enter');
    await input.fill('Item gamma');
    await input.press('Enter');
    await input.fill('Item delta');
    await input.press('Enter');
    await input.fill('Item epsilon');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Item gamma' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Item alpha', 'Item beta', 'Item delta', 'Item epsilon']);
  });
});
