import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 19', () => {
  test('marks "Update docs" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Fix bugs');
    await input.press('Enter');
    await input.fill('Update docs');
    await input.press('Enter');
    await input.fill('Release version');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Update docs' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
