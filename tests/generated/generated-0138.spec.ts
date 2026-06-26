import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 39', () => {
  test('marks "Run QA tests" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Testing cycle');
    await input.press('Enter');
    await input.fill('Run QA tests');
    await input.press('Enter');
    await input.fill('Report bugs');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Run QA tests' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
