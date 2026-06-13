import { test, expect } from '@playwright/test';

test.describe('Complete a todo – variant 1', () => {
  test('marks "Send report" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Send report');
    await input.press('Enter');
    await input.fill('Review slides');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Send report' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
