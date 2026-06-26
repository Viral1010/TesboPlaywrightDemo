import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 26', () => {
  test('marks "Fix vulnerabilities" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review security');
    await input.press('Enter');
    await input.fill('Fix vulnerabilities');
    await input.press('Enter');
    await input.fill('Verify fixes');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Fix vulnerabilities' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
