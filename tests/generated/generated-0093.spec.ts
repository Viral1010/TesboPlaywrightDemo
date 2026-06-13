import { test, expect } from '@playwright/test';

test.describe('Reload persistence – variant 3', () => {
  test('todos survive a page reload (localStorage persistence)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Persist after refresh');
    await input.press('Enter');
    await input.fill('Also this one');
    await input.press('Enter');

    await page.reload();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await expect(page.locator('.todo-list li label')).toHaveText(['Persist after refresh', 'Also this one']);
  });
});
