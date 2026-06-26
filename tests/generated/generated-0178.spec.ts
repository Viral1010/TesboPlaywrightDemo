import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 29', () => {
  test('deletes "Goal 1" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Goal 1');
    await input.press('Enter');
    await input.fill('Goal 2');
    await input.press('Enter');
    await input.fill('Goal 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Goal 1' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Goal 2', 'Goal 3']);
  });
});
