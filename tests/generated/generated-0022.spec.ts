import { test, expect } from '@playwright/test';

test.describe('Complete a todo – variant 2', () => {
  test('marks "Fix bug" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write tests');
    await input.press('Enter');
    await input.fill('Fix bug');
    await input.press('Enter');
    await input.fill('Deploy');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Fix bug' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
