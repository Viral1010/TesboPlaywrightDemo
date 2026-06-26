import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 21', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review code quality metrics');
    await input.press('Enter');
    await input.fill('Setup static analysis');
    await input.press('Enter');
    await input.fill('Configure linters');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review code quality metrics', 'Setup static analysis', 'Configure linters']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
