import { test, expect } from '@playwright/test';

test.describe('Final comprehensive test – 2', () => {
  test('final integration test with reload persistence', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    const input = page.getByPlaceholder('What needs to be done?');
    
    // Add multiple todos
    await input.fill('Final test item 1');
    await input.press('Enter');
    await input.fill('Final test item 2');
    await input.press('Enter');
    await input.fill('Final test item 3');
    await input.press('Enter');
    
    // Verify count
    await expect(page.locator('.todo-count')).toContainText('3 item');
    
    // Reload and verify persistence
    await page.reload();
    await expect(page.locator('.todo-list li label')).toHaveCount(3);
  });
});
