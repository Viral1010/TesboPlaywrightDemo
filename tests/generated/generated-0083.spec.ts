import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 34', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create capacity planning document');
    await input.press('Enter');
    await input.fill('Forecast growth');
    await input.press('Enter');
    await input.fill('Plan infrastructure');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create capacity planning document', 'Forecast growth', 'Plan infrastructure']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
