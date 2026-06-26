import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 38', () => {
  test('deletes "Time slot 2" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Time slot 1');
    await input.press('Enter');
    await input.fill('Time slot 2');
    await input.press('Enter');
    await input.fill('Time slot 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Time slot 2' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Time slot 1', 'Time slot 3']);
  });
});
