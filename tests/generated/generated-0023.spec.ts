import { test, expect } from '@playwright/test';

test.describe('Complete a todo – variant 3', () => {
  test('marks "Meditate" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Morning run');
    await input.press('Enter');
    await input.fill('Meditate');
    await input.press('Enter');
    await input.fill('Journal');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Meditate' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
