import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 32', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Closed ticket 1');
    await input.press('Enter');
    await input.fill('Open ticket 1');
    await input.press('Enter');
    await input.fill('Closed ticket 2');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Closed ticket 1' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Closed ticket 2' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Open ticket 1']);
  });
});
