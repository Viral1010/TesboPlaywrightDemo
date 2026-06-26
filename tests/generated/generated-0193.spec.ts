import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 44', () => {
  test('deletes "Review 3" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review 1');
    await input.press('Enter');
    await input.fill('Review 2');
    await input.press('Enter');
    await input.fill('Review 3');
    await input.press('Enter');
    await input.fill('Review 4');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Review 3' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Review 1', 'Review 2', 'Review 4']);
  });
});
