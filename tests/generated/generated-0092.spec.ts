import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 43', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement retry logic');
    await input.press('Enter');
    await input.fill('Add exponential backoff');
    await input.press('Enter');
    await input.fill('Configure retry limits');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement retry logic', 'Add exponential backoff', 'Configure retry limits']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
