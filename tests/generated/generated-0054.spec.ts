import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 5', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Cook dinner');
    await input.press('Enter');
    await input.fill('Do laundry');
    await input.press('Enter');
    await input.fill('Clean the house');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Cook dinner', 'Do laundry', 'Clean the house']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
