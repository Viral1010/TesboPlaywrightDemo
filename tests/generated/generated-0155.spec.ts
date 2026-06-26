import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 6', () => {
  test('deletes "Draft" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Draft');
    await input.press('Enter');
    await input.fill('Edit');
    await input.press('Enter');
    await input.fill('Approve');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Draft' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Edit', 'Approve']);
  });
});
