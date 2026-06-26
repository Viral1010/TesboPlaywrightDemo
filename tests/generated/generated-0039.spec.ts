import { test, expect } from '@playwright/test';

test.describe('Add single todo – scenario 39', () => {
  test('adds "Optimize front-end bundle size" to the todo list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Optimize front-end bundle size');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Optimize front-end bundle size']);
    await expect(page.locator('.todo-count')).toContainText('1 item');
  });
});
