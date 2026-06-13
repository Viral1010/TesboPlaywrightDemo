import { test, expect } from '@playwright/test';

test.describe('Add single todo – variant 7', () => {
  test('adds "Run full regression suite" and verifies it appears in the list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Run full regression suite');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Run full regression suite']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
