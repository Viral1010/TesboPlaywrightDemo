import { test, expect } from '@playwright/test';

test.describe('Clear completed todos – run 37', () => {
  test('clears 2 completed item(s) and verifies remaining', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Finished onboarding');
    await input.press('Enter');
    await input.fill('In progress onboarding');
    await input.press('Enter');
    await input.fill('Completed training');
    await input.press('Enter');

    await page.locator('.todo-list li').filter({ hasText: 'Finished onboarding' }).locator('input.toggle').click();
    await page.locator('.todo-list li').filter({ hasText: 'Completed training' }).locator('input.toggle').click();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText(['In progress onboarding']);
  });
});
