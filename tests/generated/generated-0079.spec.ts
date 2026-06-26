import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 30', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup application profiling');
    await input.press('Enter');
    await input.fill('Analyze metrics');
    await input.press('Enter');
    await input.fill('Optimize hot paths');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup application profiling', 'Analyze metrics', 'Optimize hot paths']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
