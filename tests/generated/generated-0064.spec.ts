import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 15', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup CI/CD pipeline');
    await input.press('Enter');
    await input.fill('Configure build scripts');
    await input.press('Enter');
    await input.fill('Setup deployment automation');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup CI/CD pipeline', 'Configure build scripts', 'Setup deployment automation']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
