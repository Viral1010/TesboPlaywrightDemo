import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 20', () => {
  test('marks "Run benchmarks" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Optimize query');
    await input.press('Enter');
    await input.fill('Run benchmarks');
    await input.press('Enter');
    await input.fill('Deploy optimization');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Run benchmarks' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
