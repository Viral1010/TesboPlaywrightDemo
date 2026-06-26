import { test, expect } from '@playwright/test';

test.describe('Add multiple todos – batch 50', () => {
  test('adds 3 todos and verifies list and count', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Create incident response plan');
    await input.press('Enter');
    await input.fill('Document procedures');
    await input.press('Enter');
    await input.fill('Schedule drills');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['Create incident response plan', 'Document procedures', 'Schedule drills']);
    await expect(page.locator('.todo-count')).toContainText('3 item');
  });
});
