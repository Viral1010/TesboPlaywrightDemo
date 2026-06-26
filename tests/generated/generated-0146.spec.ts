import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 47', () => {
  test('marks "Categorize issues" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Bug triage');
    await input.press('Enter');
    await input.fill('Categorize issues');
    await input.press('Enter');
    await input.fill('Assign owners');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Categorize issues' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
