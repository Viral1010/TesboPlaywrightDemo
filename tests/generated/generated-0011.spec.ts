import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – variant 1', () => {
  test('adds 3 todos and verifies count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await input.fill('Call dentist');
    await input.press('Enter');
    await input.fill('Pay bills');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Buy groceries', 'Call dentist', 'Pay bills']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
