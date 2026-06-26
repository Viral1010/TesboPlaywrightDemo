import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 42', () => {
  test('deletes "Sprint 2" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Sprint 1');
    await input.press('Enter');
    await input.fill('Sprint 2');
    await input.press('Enter');
    await input.fill('Sprint 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Sprint 2' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Sprint 1', 'Sprint 3']);
  });
});
