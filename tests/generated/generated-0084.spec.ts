import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 35', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement feature toggles');
    await input.press('Enter');
    await input.fill('Setup feature flags');
    await input.press('Enter');
    await input.fill('Create toggle management UI');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement feature toggles', 'Setup feature flags', 'Create toggle management UI']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
