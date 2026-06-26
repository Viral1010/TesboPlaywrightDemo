import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 42', () => {
  test('marks "Review policies" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Compliance audit');
    await input.press('Enter');
    await input.fill('Review policies');
    await input.press('Enter');
    await input.fill('Update procedures');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Review policies' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
