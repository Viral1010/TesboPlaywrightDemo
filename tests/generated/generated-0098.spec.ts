import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 49', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement rate limiting');
    await input.press('Enter');
    await input.fill('Setup throttling');
    await input.press('Enter');
    await input.fill('Configure quotas');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement rate limiting', 'Setup throttling', 'Configure quotas']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
