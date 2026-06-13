import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – variant 9', () => {
  test('adds 3 todos and verifies count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Monitor production alerts');
    await input.press('Enter');
    await input.fill('Review dashboards');
    await input.press('Enter');
    await input.fill('Update runbook');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Monitor production alerts', 'Review dashboards', 'Update runbook']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
