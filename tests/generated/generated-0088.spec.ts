import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 39', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement request tracing');
    await input.press('Enter');
    await input.fill('Add timing instrumentation');
    await input.press('Enter');
    await input.fill('Create performance report');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement request tracing', 'Add timing instrumentation', 'Create performance report']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
