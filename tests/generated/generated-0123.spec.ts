import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 24', () => {
  test('marks "Run migrations" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create database');
    await input.press('Enter');
    await input.fill('Run migrations');
    await input.press('Enter');
    await input.fill('Verify schema');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Run migrations' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
