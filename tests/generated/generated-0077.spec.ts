import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 28', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create deployment checklist');
    await input.press('Enter');
    await input.fill('Setup pre-flight checks');
    await input.press('Enter');
    await input.fill('Document rollback steps');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create deployment checklist', 'Setup pre-flight checks', 'Document rollback steps']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
