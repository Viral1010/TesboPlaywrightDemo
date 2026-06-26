import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 20', () => {
  test('deletes "Action 3" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Action 1');
    await input.press('Enter');
    await input.fill('Action 2');
    await input.press('Enter');
    await input.fill('Action 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Action 3' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Action 1', 'Action 2']);
  });
});
