import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 3', () => {
  test('deletes "Task A" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Task A');
    await input.press('Enter');
    await input.fill('Task B');
    await input.press('Enter');
    await input.fill('Task C');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Task A' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Task B', 'Task C']);
  });
});
