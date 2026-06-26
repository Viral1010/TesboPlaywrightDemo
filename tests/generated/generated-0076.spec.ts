import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 27', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement logging framework');
    await input.press('Enter');
    await input.fill('Configure log levels');
    await input.press('Enter');
    await input.fill('Setup log retention');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement logging framework', 'Configure log levels', 'Setup log retention']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
