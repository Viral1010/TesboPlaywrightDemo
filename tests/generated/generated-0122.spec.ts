import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 23', () => {
  test('marks "Design API" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Design API');
    await input.press('Enter');
    await input.fill('Implement endpoints');
    await input.press('Enter');
    await input.fill('Write tests');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Design API' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
