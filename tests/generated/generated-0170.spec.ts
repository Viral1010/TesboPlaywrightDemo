import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 21', () => {
  test('deletes "Test 2" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Test 1');
    await input.press('Enter');
    await input.fill('Test 2');
    await input.press('Enter');
    await input.fill('Test 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Test 2' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Test 1', 'Test 3']);
  });
});
