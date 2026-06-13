import { test, expect } from '@playwright/test';

test.describe('Delete a todo – variant 10', () => {
  test('deletes "Agree" and verifies the remaining list', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Propose');
    await input.press('Enter');
    await input.fill('Agree');
    await input.press('Enter');
    await input.fill('Deliver');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Agree' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Propose', 'Deliver']);
  });
});
