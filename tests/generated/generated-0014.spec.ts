import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – variant 4', () => {
  test('adds 3 todos and verifies count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Write feature tests');
    await input.press('Enter');
    await input.fill('Fix ESLint warnings');
    await input.press('Enter');
    await input.fill('Submit pull request');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Write feature tests', 'Fix ESLint warnings', 'Submit pull request']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
