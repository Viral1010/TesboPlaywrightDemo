import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 39', () => {
  test('deletes "Entry 1" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Entry 1');
    await input.press('Enter');
    await input.fill('Entry 2');
    await input.press('Enter');
    await input.fill('Entry 3');
    await input.press('Enter');
    await input.fill('Entry 4');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Entry 1' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Entry 2', 'Entry 3', 'Entry 4']);
  });
});
