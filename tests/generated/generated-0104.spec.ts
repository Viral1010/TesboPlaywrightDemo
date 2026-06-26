import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 5', () => {
  test('marks "Set goals" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Plan week');
    await input.press('Enter');
    await input.fill('Set goals');
    await input.press('Enter');
    await input.fill('Review OKRs');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Set goals' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
