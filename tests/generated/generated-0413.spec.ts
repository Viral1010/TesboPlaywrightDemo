import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 17', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Completed task 1');
    await input.press('Enter');
    await input.fill('Incomplete task 1');
    await input.press('Enter');
    await input.fill('Completed task 2');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Completed task 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Completed task 2' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Incomplete task 1']);
  });
});
