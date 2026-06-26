import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 9', () => {
  test('marks "Install deps" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup environment');
    await input.press('Enter');
    await input.fill('Install deps');
    await input.press('Enter');
    await input.fill('Run tests');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Install deps' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
