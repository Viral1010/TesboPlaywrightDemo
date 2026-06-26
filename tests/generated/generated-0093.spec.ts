import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 44', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup compliance scanning');
    await input.press('Enter');
    await input.fill('Implement policy checks');
    await input.press('Enter');
    await input.fill('Create audit reports');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup compliance scanning', 'Implement policy checks', 'Create audit reports']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
