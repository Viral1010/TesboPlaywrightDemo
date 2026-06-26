import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 50', () => {
  test('marks "Check metrics" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('System monitoring');
    await input.press('Enter');
    await input.fill('Check metrics');
    await input.press('Enter');
    await input.fill('Create alerts');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Check metrics' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
