import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 45', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Completed checkpoint');
    await input.press('Enter');
    await input.fill('In progress checkpoint');
    await input.press('Enter');
    await input.fill('Finished review');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Completed checkpoint' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Finished review' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['In progress checkpoint']);
  });
});
