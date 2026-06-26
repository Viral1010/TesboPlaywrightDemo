import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 13', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Update dependencies');
    await input.press('Enter');
    await input.fill('Run security audit');
    await input.press('Enter');
    await input.fill('Apply security patches');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Update dependencies', 'Run security audit', 'Apply security patches']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
