import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 12', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review team performance');
    await input.press('Enter');
    await input.fill('Provide feedback');
    await input.press('Enter');
    await input.fill('Set career goals');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review team performance', 'Provide feedback', 'Set career goals']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
