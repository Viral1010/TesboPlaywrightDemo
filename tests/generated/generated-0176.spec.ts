import { test, expect } from '@playwright/test';

test.describe('Delete a todo – iteration 27', () => {
  test('deletes "Event 2" and verifies list accuracy', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Event 1');
    await input.press('Enter');
    await input.fill('Event 2');
    await input.press('Enter');
    await input.fill('Event 3');
    await input.press('Enter');
    await input.fill('Event 4');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Event 2' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText(['Event 1', 'Event 3', 'Event 4']);
  });
});
