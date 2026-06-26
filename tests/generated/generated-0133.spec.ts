import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 34', () => {
  test('marks "Set targets" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Performance review');
    await input.press('Enter');
    await input.fill('Set targets');
    await input.press('Enter');
    await input.fill('Develop plan');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Set targets' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
