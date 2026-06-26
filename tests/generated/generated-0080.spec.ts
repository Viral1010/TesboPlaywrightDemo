import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 31', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement circuit breakers');
    await input.press('Enter');
    await input.fill('Add fallback strategies');
    await input.press('Enter');
    await input.fill('Configure timeouts');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement circuit breakers', 'Add fallback strategies', 'Configure timeouts']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
