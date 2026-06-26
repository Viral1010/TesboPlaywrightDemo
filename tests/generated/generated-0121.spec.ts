import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 22', () => {
  test('marks "Configure levels" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup logging');
    await input.press('Enter');
    await input.fill('Configure levels');
    await input.press('Enter');
    await input.fill('Archive logs');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Configure levels' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
