import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 16', () => {
  test('marks "Configure alerts" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup monitoring');
    await input.press('Enter');
    await input.fill('Configure alerts');
    await input.press('Enter');
    await input.fill('Test alerts');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Configure alerts' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
