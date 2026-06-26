import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 36', () => {
  test('marks "Backup old data" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Database migration');
    await input.press('Enter');
    await input.fill('Backup old data');
    await input.press('Enter');
    await input.fill('Verify new data');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Backup old data' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
