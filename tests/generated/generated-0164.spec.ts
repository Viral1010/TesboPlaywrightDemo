import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 15', () => {
  test('deletes "Phase 3" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Phase 1');
    await input.press('Enter');
    await input.fill('Phase 2');
    await input.press('Enter');
    await input.fill('Phase 3');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Phase 3' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Phase 1', 'Phase 2']);
  });
});
