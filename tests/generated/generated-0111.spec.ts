import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 12', () => {
  test('marks "Verify backup" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Backup data');
    await input.press('Enter');
    await input.fill('Verify backup');
    await input.press('Enter');
    await input.fill('Document process');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Verify backup' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
