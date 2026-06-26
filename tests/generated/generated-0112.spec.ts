import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 13', () => {
  test('marks "Plan sprint" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Plan sprint');
    await input.press('Enter');
    await input.fill('Assign tasks');
    await input.press('Enter');
    await input.fill('Start work');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Plan sprint' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
