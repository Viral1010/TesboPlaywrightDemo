import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 36', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review API contracts');
    await input.press('Enter');
    await input.fill('Update schema definitions');
    await input.press('Enter');
    await input.fill('Publish API changes');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review API contracts', 'Update schema definitions', 'Publish API changes']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
