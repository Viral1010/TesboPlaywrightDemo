import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 30', () => {
  test('marks "Identify issues" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Analyze performance');
    await input.press('Enter');
    await input.fill('Identify issues');
    await input.press('Enter');
    await input.fill('Plan fixes');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Identify issues' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
