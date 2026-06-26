import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 10', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Plan next sprint');
    await input.press('Enter');
    await input.fill('Assign tasks to team');
    await input.press('Enter');
    await input.fill('Set delivery deadlines');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Plan next sprint', 'Assign tasks to team', 'Set delivery deadlines']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
