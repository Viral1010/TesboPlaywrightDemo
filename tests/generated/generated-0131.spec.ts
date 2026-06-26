import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 32', () => {
  test('marks "Present proposal" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Client meeting');
    await input.press('Enter');
    await input.fill('Present proposal');
    await input.press('Enter');
    await input.fill('Gather feedback');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Present proposal' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
