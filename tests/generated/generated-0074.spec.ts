import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 25', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create user roles');
    await input.press('Enter');
    await input.fill('Assign permissions');
    await input.press('Enter');
    await input.fill('Implement authorization');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create user roles', 'Assign permissions', 'Implement authorization']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
