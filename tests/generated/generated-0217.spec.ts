import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 18', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Q1 task');
    await input.press('Enter');
    await input.fill('Q2 task');
    await input.press('Enter');
    await input.fill('Q3 task');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Q1 task' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Q2 task', 'Q3 task']);
  });
});
