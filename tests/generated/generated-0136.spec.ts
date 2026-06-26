import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 37', () => {
  test('marks "Deprecate v1" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('API versioning');
    await input.press('Enter');
    await input.fill('Deprecate v1');
    await input.press('Enter');
    await input.fill('Support v2');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Deprecate v1' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
