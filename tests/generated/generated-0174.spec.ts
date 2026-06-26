import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 25', () => {
  test('deletes "Priority 2" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Priority 1');
    await input.press('Enter');
    await input.fill('Priority 2');
    await input.press('Enter');
    await input.fill('Priority 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Priority 2' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Priority 1', 'Priority 3']);
  });
});
