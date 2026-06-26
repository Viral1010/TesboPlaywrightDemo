import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 41', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement auto-scaling policies');
    await input.press('Enter');
    await input.fill('Configure thresholds');
    await input.press('Enter');
    await input.fill('Test scaling');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Implement auto-scaling policies', 'Configure thresholds', 'Test scaling']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
