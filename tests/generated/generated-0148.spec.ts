import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 49', () => {
  test('marks "Plan quarters" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Product roadmap');
    await input.press('Enter');
    await input.fill('Plan quarters');
    await input.press('Enter');
    await input.fill('Update stakeholders');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Plan quarters' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
