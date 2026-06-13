import { test, expect } from '@playwright/test';

test.describe('Complete a todo – variant 8', () => {
  test('marks "Proofread" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Draft email');
    await input.press('Enter');
    await input.fill('Proofread');
    await input.press('Enter');
    await input.fill('Send to team');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Proofread' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
