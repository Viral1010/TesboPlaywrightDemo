#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../tests/generated');
const BASE_URL = 'https://demo.playwright.dev/todomvc';

const existing = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.spec.ts'));
let idx = existing.length + 1;

function pad(n) { return String(n).padStart(4, '0'); }

function write(describeName, testName, body) {
  const n = pad(idx++);
  const content =
`import { test, expect } from '@playwright/test';

test.describe('${describeName}', () => {
  test('${testName}', async ({ page }) => {
    await page.goto('${BASE_URL}');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

${body}
  });
});
`;
  fs.writeFileSync(path.join(OUT_DIR, `generated-${n}.spec.ts`), content);
}

// Add final 2 tests
write(
  'Final comprehensive test – 1',
  'comprehensive test covering all major features',
  `    const input = page.getByPlaceholder('What needs to be done?');
    
    // Add todos
    await input.fill('Comprehensive test 1');
    await input.press('Enter');
    await input.fill('Comprehensive test 2');
    await input.press('Enter');
    
    // Complete one
    await page.locator('.todo-list li input.toggle').first().click();
    
    // Verify
    await expect(page.locator('.todo-count')).toContainText('1 item');
    await expect(page.locator('.todo-list li.completed')).toHaveCount(1);`
);

write(
  'Final comprehensive test – 2',
  'final integration test with reload persistence',
  `    const input = page.getByPlaceholder('What needs to be done?');
    
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
    await expect(page.locator('.todo-list li label')).toHaveCount(3);`
);

console.log(`Final count: ${idx - 1} tests`);
