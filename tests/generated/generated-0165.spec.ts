import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 16', () => {
  test('deletes "Module B" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Module A');
    await input.press('Enter');
    await input.fill('Module B');
    await input.press('Enter');
    await input.fill('Module C');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Module B' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Module A', 'Module C']);
  });
});
