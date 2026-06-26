import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 27', () => {
  test('marks "Implement design" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Plan architecture');
    await input.press('Enter');
    await input.fill('Implement design');
    await input.press('Enter');
    await input.fill('Review design');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Implement design' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
