import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 25', () => {
  test('marks "Deploy to staging" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Deploy to staging');
    await input.press('Enter');
    await input.fill('Run tests');
    await input.press('Enter');
    await input.fill('Deploy to prod');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Deploy to staging' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
