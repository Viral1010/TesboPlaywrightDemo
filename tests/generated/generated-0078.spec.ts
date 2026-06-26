import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 29', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Review application security');
    await input.press('Enter');
    await input.fill('Conduct penetration testing');
    await input.press('Enter');
    await input.fill('Fix vulnerabilities');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Review application security', 'Conduct penetration testing', 'Fix vulnerabilities']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
