import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 8', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create UI mockup');
    await input.press('Enter');
    await input.fill('Gather design feedback');
    await input.press('Enter');
    await input.fill('Implement component');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create UI mockup', 'Gather design feedback', 'Implement component']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
