import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 1', () => {
  test('deletes "Delete this" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Keep this');
    await input.press('Enter');
    await input.fill('Delete this');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Delete this' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Keep this']);
  });
});
