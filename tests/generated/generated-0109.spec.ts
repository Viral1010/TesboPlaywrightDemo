import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 10', () => {
  test('marks "Create branch" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create branch');
    await input.press('Enter');
    await input.fill('Implement feature');
    await input.press('Enter');
    await input.fill('Open PR');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Create branch' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
