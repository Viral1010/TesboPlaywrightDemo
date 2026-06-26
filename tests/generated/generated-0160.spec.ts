import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 11', () => {
  test('deletes "Item 3" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item 1');
    await input.press('Enter');
    await input.fill('Item 2');
    await input.press('Enter');
    await input.fill('Item 3');
    await input.press('Enter');
    await input.fill('Item 4');
    await input.press('Enter');
    await input.fill('Item 5');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Item 3' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Item 1', 'Item 2', 'Item 4', 'Item 5']);
  });
});
