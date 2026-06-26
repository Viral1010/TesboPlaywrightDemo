import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 24', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Configure SSL certificates');
    await input.press('Enter');
    await input.fill('Setup HTTPS');
    await input.press('Enter');
    await input.fill('Update security headers');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Configure SSL certificates', 'Setup HTTPS', 'Update security headers']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
