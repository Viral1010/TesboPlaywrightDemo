import { test, expect } from '@playwright/test';

test.describe('Toggle all todos – scenario 15', () => {
  test('marks all 4 todos as completed via toggle-all', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Service 1');
    await input.press('Enter');
    await input.fill('Service 2');
    await input.press('Enter');
    await input.fill('Service 3');
    await input.press('Enter');
    await input.fill('Service 4');
    await input.press('Enter');

    await page.locator('.toggle-all').check();

    const toggles = page.locator('.todo-list li input.toggle');
    const count = await toggles.count();
    for (let i = 0; i < count; i++) {
      await expect(toggles.nth(i)).toBeChecked();
    }
  });
});
