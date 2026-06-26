import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 6', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Code review');
    await input.press('Enter');
    await input.fill('Unit tests');
    await input.press('Enter');
    await input.fill('Deploy');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Unit tests' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Code review', 'Deploy']);
  });
});
