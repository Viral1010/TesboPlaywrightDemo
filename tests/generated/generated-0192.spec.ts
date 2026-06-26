import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 43', () => {
  test('deletes "Document 1" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Document 1');
    await input.press('Enter');
    await input.fill('Document 2');
    await input.press('Enter');
    await input.fill('Document 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Document 1' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Document 2', 'Document 3']);
  });
});
