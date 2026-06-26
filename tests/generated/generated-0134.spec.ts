import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 35', () => {
  test('marks "Analyze results" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Security scan');
    await input.press('Enter');
    await input.fill('Analyze results');
    await input.press('Enter');
    await input.fill('Fix issues');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Analyze results' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
