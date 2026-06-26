import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 45', () => {
  test('marks "Create materials" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Team training');
    await input.press('Enter');
    await input.fill('Create materials');
    await input.press('Enter');
    await input.fill('Conduct session');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Create materials' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
