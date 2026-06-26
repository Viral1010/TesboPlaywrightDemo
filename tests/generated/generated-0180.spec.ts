import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 31', () => {
  test('deletes "Milestone 1" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Milestone 1');
    await input.press('Enter');
    await input.fill('Milestone 2');
    await input.press('Enter');
    await input.fill('Milestone 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Milestone 1' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Milestone 2', 'Milestone 3']);
  });
});
