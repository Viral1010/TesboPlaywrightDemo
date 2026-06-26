import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 5', () => {
  test('deletes "Execute" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Plan');
    await input.press('Enter');
    await input.fill('Execute');
    await input.press('Enter');
    await input.fill('Review');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Execute' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Plan', 'Review']);
  });
});
