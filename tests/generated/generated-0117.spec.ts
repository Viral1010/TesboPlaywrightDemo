import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 18', () => {
  test('marks "Implement feature" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Implement feature');
    await input.press('Enter');
    await input.fill('Add tests');
    await input.press('Enter');
    await input.fill('Document API');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Implement feature' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
