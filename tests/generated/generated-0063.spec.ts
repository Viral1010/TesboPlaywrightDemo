import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 14', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create user guides');
    await input.press('Enter');
    await input.fill('Record video tutorial');
    await input.press('Enter');
    await input.fill('Publish documentation');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create user guides', 'Record video tutorial', 'Publish documentation']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
