const fs = require('fs');
const path = require('path');

const TOTAL_TESTS = 1000;
const targetDir = path.join(__dirname, '..', 'tests', 'generated');

fs.mkdirSync(targetDir, { recursive: true });

for (let index = 1; index <= TOTAL_TESTS; index += 1) {
  const id = index.toString().padStart(4, '0');
  // Vary timings to give each test distinct step durations.
  const warmupMs = 25 + (index % 40); // 25-64ms
  const midMs = 50 + ((index * 3) % 70); // 50-119ms
  const finalMs = 80 + ((index * 7) % 90); // 80-169ms

  const spec = `import { test, expect } from '@playwright/test';

test.describe('Generated scenario ${id}', () => {
  test('generated test ${id}', async ({ page }) => {
    await test.step('warmup wait ${warmupMs}ms', async () => {
      await page.waitForTimeout(${warmupMs});
    });

    await test.step('mid-step wait ${midMs}ms', async () => {
      // Navigate to a lightweight page to keep runtime small.
      await page.goto('about:blank');
      await page.waitForTimeout(${midMs});
    });

    await test.step('final confirmation ${finalMs}ms', async () => {
      await page.waitForTimeout(${finalMs});
      await expect(true).toBeTruthy();
    });
  });
});
`;

  const filePath = path.join(targetDir, `generated-${id}.spec.ts`);
  fs.writeFileSync(filePath, spec, 'utf8');
}

console.log('Wrote ' + TOTAL_TESTS + ' generated spec files to ' + targetDir);

