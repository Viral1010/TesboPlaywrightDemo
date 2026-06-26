import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 41', () => {
  test('marks "Migrate services" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Infrastructure upgrade');
    await input.press('Enter');
    await input.fill('Migrate services');
    await input.press('Enter');
    await input.fill('Verify stability');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Migrate services' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
