import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 37', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Setup chaos engineering tests');
    await input.press('Enter');
    await input.fill('Plan failure scenarios');
    await input.press('Enter');
    await input.fill('Document mitigation');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Setup chaos engineering tests', 'Plan failure scenarios', 'Document mitigation']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
