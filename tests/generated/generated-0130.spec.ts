import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 31', () => {
  test('marks "Tag commit" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Version release');
    await input.press('Enter');
    await input.fill('Tag commit');
    await input.press('Enter');
    await input.fill('Update changelog');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Tag commit' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
