import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 38', () => {
  test('marks "Remove dead code" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Code cleanup');
    await input.press('Enter');
    await input.fill('Remove dead code');
    await input.press('Enter');
    await input.fill('Update imports');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Remove dead code' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
