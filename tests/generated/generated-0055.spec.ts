import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 6', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Study React hooks');
    await input.press('Enter');
    await input.fill('Practice TypeScript generics');
    await input.press('Enter');
    await input.fill('Build demo app');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Study React hooks', 'Practice TypeScript generics', 'Build demo app']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
