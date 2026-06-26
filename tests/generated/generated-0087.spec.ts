import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 38', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create service health checks');
    await input.press('Enter');
    await input.fill('Implement heartbeat monitoring');
    await input.press('Enter');
    await input.fill('Setup alerts');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create service health checks', 'Implement heartbeat monitoring', 'Setup alerts']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
