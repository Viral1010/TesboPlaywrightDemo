import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – variant 3', () => {
  test('adds 3 todos and verifies count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Read emails');
    await input.press('Enter');
    await input.fill('Reply to clients');
    await input.press('Enter');
    await input.fill('Update Jira ticket');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Read emails', 'Reply to clients', 'Update Jira ticket']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
