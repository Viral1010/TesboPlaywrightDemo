import { test, expect } from '@playwright/test';

test.describe('Filter active todos – run 25', () => {
  test('displays only active todos after completing 1 item(s)', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Ticket 101');
    await input.press('Enter');
    await input.fill('Ticket 102');
    await input.press('Enter');
    await input.fill('Ticket 103');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Ticket 102' }).locator('input.toggle').click();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText(['Ticket 101', 'Ticket 103']);
  });
});
