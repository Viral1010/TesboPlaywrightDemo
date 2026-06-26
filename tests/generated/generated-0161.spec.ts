import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 12', () => {
  test('deletes "Feature spec" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Feature spec');
    await input.press('Enter');
    await input.fill('Review spec');
    await input.press('Enter');
    await input.fill('Implement');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Feature spec' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Review spec', 'Implement']);
  });
});
