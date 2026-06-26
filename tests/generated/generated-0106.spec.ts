import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 7', () => {
  test('marks "Review ERD" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Design schema');
    await input.press('Enter');
    await input.fill('Review ERD');
    await input.press('Enter');
    await input.fill('Migrate data');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Review ERD' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
