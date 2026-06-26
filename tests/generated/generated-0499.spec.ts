import { test, expect } from '@playwright/test';

test.describe('Final comprehensive test – 1', () => {
  test('comprehensive test covering all major features', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    
    // Add todos
    await input.fill('Comprehensive test 1');
    await input.press('Enter');
    await input.fill('Comprehensive test 2');
    await input.press('Enter');
    
    // Complete one
    await page.locator('.todo-list li input.toggle').first().click();
    
    // Verify
    await expect(page.locator('.todo-count')).toContainText('1 item');
    await expect(page.locator('.todo-list li.completed')).toHaveCount(1);
  });
});
