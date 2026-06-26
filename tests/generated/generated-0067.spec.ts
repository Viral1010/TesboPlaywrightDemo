import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 18', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Audit user permissions');
    await input.press('Enter');
    await input.fill('Review access logs');
    await input.press('Enter');
    await input.fill('Update security policies');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Audit user permissions', 'Review access logs', 'Update security policies']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
