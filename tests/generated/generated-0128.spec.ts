import { test, expect } from '@playwright/test';

test.describe('Complete a todo – case 29', () => {
  test('marks "Configure builds" as completed', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup CI/CD');
    await input.press('Enter');
    await input.fill('Configure builds');
    await input.press('Enter');
    await input.fill('Test pipeline');
    await input.press('Enter');

    const targetItem = page.locator('.todo-list li').filter({ hasText: 'Configure builds' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);
  });
});
