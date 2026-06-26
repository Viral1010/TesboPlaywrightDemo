import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 23', () => {
  test('deletes "Version C" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Version A');
    await input.press('Enter');
    await input.fill('Version B');
    await input.press('Enter');
    await input.fill('Version C');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Version C' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Version A', 'Version B']);
  });
});
