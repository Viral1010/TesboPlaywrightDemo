import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 17', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Design database schema');
    await input.press('Enter');
    await input.fill('Create ERD diagram');
    await input.press('Enter');
    await input.fill('Write SQL migrations');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Design database schema', 'Create ERD diagram', 'Write SQL migrations']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
