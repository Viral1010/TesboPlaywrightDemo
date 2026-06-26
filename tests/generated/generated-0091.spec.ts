import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 42', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create runbook templates');
    await input.press('Enter');
    await input.fill('Document incidents');
    await input.press('Enter');
    await input.fill('Setup incident tracking');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create runbook templates', 'Document incidents', 'Setup incident tracking']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
