import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 40', () => {
  test('deletes "Region 3" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Region 1');
    await input.press('Enter');
    await input.fill('Region 2');
    await input.press('Enter');
    await input.fill('Region 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Region 3' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Region 1', 'Region 2']);
  });
});
