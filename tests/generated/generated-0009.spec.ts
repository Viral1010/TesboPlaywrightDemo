import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 9', () => {
  test('adds "Set up GitHub Actions CI pipeline" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Set up GitHub Actions CI pipeline');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Set up GitHub Actions CI pipeline']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
