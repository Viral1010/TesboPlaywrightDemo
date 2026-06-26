import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 7', () => {
  test('deletes "Test" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Design');
    await input.press('Enter');
    await input.fill('Build');
    await input.press('Enter');
    await input.fill('Test');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Test' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Design', 'Build']);
  });
});
