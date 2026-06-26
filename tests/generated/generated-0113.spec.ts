import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 14', () => {
  test('marks "Write spec" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write spec');
    await input.press('Enter');
    await input.fill('Get approval');
    await input.press('Enter');
    await input.fill('Start development');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Write spec' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
