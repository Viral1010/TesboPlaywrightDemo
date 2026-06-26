import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 28', () => {
  test('marks "Create examples" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write documentation');
    await input.press('Enter');
    await input.fill('Create examples');
    await input.press('Enter');
    await input.fill('Publish docs');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Create examples' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
