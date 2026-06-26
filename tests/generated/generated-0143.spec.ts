import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 44', () => {
  test('marks "Apply patches" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('System maintenance');
    await input.press('Enter');
    await input.fill('Apply patches');
    await input.press('Enter');
    await input.fill('Monitor system');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Apply patches' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
