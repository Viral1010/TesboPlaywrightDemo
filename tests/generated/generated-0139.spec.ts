import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 40', () => {
  test('marks "Add examples" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Documentation update');
    await input.press('Enter');
    await input.fill('Add examples');
    await input.press('Enter');
    await input.fill('Publish guide');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Add examples' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
