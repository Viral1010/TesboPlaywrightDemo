import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 33', () => {
  test('marks "Update status" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Team standup');
    await input.press('Enter');
    await input.fill('Update status');
    await input.press('Enter');
    await input.fill('Plan blockers');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Update status' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
