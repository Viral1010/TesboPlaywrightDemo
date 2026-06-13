import { test, expect } from '@playwright/test';

test.describe('Toggle all todos – variant 4', () => {
  test('marks all 4 todos as completed with toggle-all', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Design');
    await input.press('Enter');
    await input.fill('Develop');
    await input.press('Enter');
    await input.fill('Test');
    await input.press('Enter');
    await input.fill('Deploy');
    await input.press('Enter');

    await page.locator('.toggle-all').check();

    const toggles = page.locator('.todo-list li input.toggle');
    const count = await toggles.count();
    for (let i = 0; i < count; i++) {
      await expect(toggles.nth(i)).toBeChecked();
    }
  });
});
