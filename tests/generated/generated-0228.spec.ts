import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 29', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Goal 1');
    await input.press('Enter');
    await input.fill('Goal 2');
    await input.press('Enter');
    await input.fill('Goal 3');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Goal 1' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Goal 2', 'Goal 3']);
  });
});
