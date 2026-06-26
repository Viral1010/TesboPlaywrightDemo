import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 48', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Done event');
    await input.press('Enter');
    await input.fill('Pending event');
    await input.press('Enter');
    await input.fill('Scheduled event');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Done event' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Scheduled event' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Pending event']);
  });
});
