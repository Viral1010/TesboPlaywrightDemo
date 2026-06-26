import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 10', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Resolved incident');
    await input.press('Enter');
    await input.fill('Monitor metrics');
    await input.press('Enter');
    await input.fill('Update docs');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Resolved incident' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Update docs' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Monitor metrics']);
  });
});
