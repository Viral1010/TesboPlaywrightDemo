import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 13', () => {
  test('displays only active todos after completing 2 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup');
    await input.press('Enter');
    await input.fill('Configure');
    await input.press('Enter');
    await input.fill('Verify');
    await input.press('Enter');
    await input.fill('Deploy');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Setup' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Verify' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Configure', 'Deploy']);
  });
});
