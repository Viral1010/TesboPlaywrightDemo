import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 33', () => {
  test('deletes "Batch 3" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Batch 1');
    await input.press('Enter');
    await input.fill('Batch 2');
    await input.press('Enter');
    await input.fill('Batch 3');
    await input.press('Enter');
    await input.fill('Batch 4');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Batch 3' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Batch 1', 'Batch 2', 'Batch 4']);
  });
});
