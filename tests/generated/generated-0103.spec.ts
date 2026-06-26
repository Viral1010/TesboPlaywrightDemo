import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 4', () => {
  test('marks "Take notes" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Read book');
    await input.press('Enter');
    await input.fill('Take notes');
    await input.press('Enter');
    await input.fill('Summarise');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Take notes' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
