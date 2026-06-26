import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 26', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Analyze system performance');
    await input.press('Enter');
    await input.fill('Identify bottlenecks');
    await input.press('Enter');
    await input.fill('Plan optimizations');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Analyze system performance', 'Identify bottlenecks', 'Plan optimizations']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
