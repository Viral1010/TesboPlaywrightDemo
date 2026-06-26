import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 32', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create database backup schedule');
    await input.press('Enter');
    await input.fill('Automate backups');
    await input.press('Enter');
    await input.fill('Test restore process');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create database backup schedule', 'Automate backups', 'Test restore process']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
