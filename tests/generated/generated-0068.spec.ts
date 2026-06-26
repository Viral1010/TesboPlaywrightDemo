import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 19', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup monitoring alerts');
    await input.press('Enter');
    await input.fill('Configure dashboards');
    await input.press('Enter');
    await input.fill('Create runbooks');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup monitoring alerts', 'Configure dashboards', 'Create runbooks']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
