import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 21', () => {
  test('marks "Implement caching" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement caching');
    await input.press('Enter');
    await input.fill('Test performance');
    await input.press('Enter');
    await input.fill('Monitor metrics');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Implement caching' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
