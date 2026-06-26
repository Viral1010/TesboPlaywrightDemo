import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 42', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Finished migration');
    await input.press('Enter');
    await input.fill('In progress migration');
    await input.press('Enter');
    await input.fill('Completed cutover');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Finished migration' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Completed cutover' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['In progress migration']);
  });
});
