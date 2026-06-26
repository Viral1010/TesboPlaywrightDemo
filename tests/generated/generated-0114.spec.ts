import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 15', () => {
  test('marks "Gather feedback" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create mockup');
    await input.press('Enter');
    await input.fill('Gather feedback');
    await input.press('Enter');
    await input.fill('Refine design');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Gather feedback' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
