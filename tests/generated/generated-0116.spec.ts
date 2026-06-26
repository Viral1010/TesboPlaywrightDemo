import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 17', () => {
  test('marks "Request changes" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review code');
    await input.press('Enter');
    await input.fill('Request changes');
    await input.press('Enter');
    await input.fill('Merge PR');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Request changes' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
