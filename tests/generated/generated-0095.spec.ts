import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 46', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create upgrade documentation');
    await input.press('Enter');
    await input.fill('Plan migration strategy');
    await input.press('Enter');
    await input.fill('Setup parallel runs');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create upgrade documentation', 'Plan migration strategy', 'Setup parallel runs']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
