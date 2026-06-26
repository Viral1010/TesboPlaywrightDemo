import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 16', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement caching');
    await input.press('Enter');
    await input.fill('Optimize queries');
    await input.press('Enter');
    await input.fill('Benchmark improvements');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement caching', 'Optimize queries', 'Benchmark improvements']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
