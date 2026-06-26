import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 13', () => {
  test('deletes "Bug report" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Bug report');
    await input.press('Enter');
    await input.fill('Investigate');
    await input.press('Enter');
    await input.fill('Fix');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Bug report' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Investigate', 'Fix']);
  });
});
