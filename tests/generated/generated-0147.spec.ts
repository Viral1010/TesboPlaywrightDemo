import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 48', () => {
  test('marks "Document design" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Architecture review');
    await input.press('Enter');
    await input.fill('Document design');
    await input.press('Enter');
    await input.fill('Get approval');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Document design' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
