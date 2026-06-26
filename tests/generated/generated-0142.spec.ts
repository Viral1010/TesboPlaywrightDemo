import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 43', () => {
  test('marks "Gather requirements" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Feature demo');
    await input.press('Enter');
    await input.fill('Gather requirements');
    await input.press('Enter');
    await input.fill('Update specs');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Gather requirements' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
