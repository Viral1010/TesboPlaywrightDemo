import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 45', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review third-party dependencies');
    await input.press('Enter');
    await input.fill('Update vulnerable packages');
    await input.press('Enter');
    await input.fill('Test compatibility');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review third-party dependencies', 'Update vulnerable packages', 'Test compatibility']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
