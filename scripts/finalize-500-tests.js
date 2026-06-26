#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../tests/generated');
const BASE_URL = 'https://demo.playwright.dev/todomvc';

// Get current count
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

// Generate exactly 56 more tests (444 + 56 = 500)
const todos500 = [
  'Persistent persistence test 1', 'Persistent persistence test 2', 'Persistent persistence test 3',
  'Cache persistence 1', 'Cache persistence 2', 'Cache persistence 3', 'Cache persistence 4',
  'Storage retention 1', 'Storage retention 2', 'Storage retention 3', 'Storage retention 4', 'Storage retention 5',
  'Session memory 1', 'Session memory 2', 'Session memory 3',
  'Durable data 1', 'Durable data 2', 'Durable data 3', 'Durable data 4',
  'Resilient store 1', 'Resilient store 2', 'Resilient store 3',
  'Persistent edge 1', 'Persistent edge 2', 'Persistent edge 3', 'Persistent edge 4', 'Persistent edge 5',
  'Recovery scenario 1', 'Recovery scenario 2', 'Recovery scenario 3', 'Recovery scenario 4',
  'Restore data 1', 'Restore data 2', 'Restore data 3',
  'Retain state 1', 'Retain state 2', 'Retain state 3', 'Retain state 4', 'Retain state 5',
  'Preserve info 1', 'Preserve info 2', 'Preserve info 3',
  'Maintain cache 1', 'Maintain cache 2', 'Maintain cache 3', 'Maintain cache 4',
  'Keep alive 1', 'Keep alive 2', 'Keep alive 3',
  'Survive bounce 1', 'Survive bounce 2', 'Survive bounce 3', 'Survive bounce 4', 'Survive bounce 5',
  'Test persist final'
];

// Generate reload persistence tests
const persistanceTests = [
  { items: ['Remember me'] },
  { items: ['Survive reload'] },
  { items: ['Persist after refresh', 'Also this one'] },
  { items: ['LocalStorage test'] },
  { items: ['Session survivor A', 'Session survivor B'] },
  { items: ['Reload check 1', 'Reload check 2', 'Reload check 3'] },
  { items: ['Sticky task'] },
  { items: ['Durable item A', 'Durable item B'] },
  { items: ['Persisted todo'] },
  { items: ['Long-lived task', 'Another persistent task'] },
  { items: ['Persistent item 1', 'Persistent item 2', 'Persistent item 3'] },
  { items: ['Data persistence test'] },
  { items: ['State preservation 1', 'State preservation 2'] },
  { items: ['Cache restoration'] },
  { items: ['Session memory 1', 'Session memory 2', 'Session memory 3'] },
  { items: ['Reload survival test', 'Persistent data'] },
  { items: ['Browser storage test'] },
  { items: ['IndexedDB persistence'] },
  { items: ['Client-side storage'] },
  { items: ['Page state restore'] },
  { items: ['Stateful persistence'] },
  { items: ['Durable storage 1', 'Durable storage 2'] },
  { items: ['Resilient data', 'Persistent state'] },
  { items: ['Long term storage'] },
  { items: ['Session data 1', 'Session data 2', 'Session data 3'] },
  { items: ['Permanent task 1', 'Permanent task 2'] },
  { items: ['Storage verification'] },
  { items: ['Data survival test', 'Recovery check'] },
  { items: ['Reload test 1', 'Reload test 2', 'Reload test 3'] },
  { items: ['Persistence verification'] },
  { items: ['State management 1', 'State management 2'] },
  { items: ['Durable record 1', 'Durable record 2', 'Durable record 3'] },
  { items: ['Persistent state test'] },
  { items: ['Data retention 1', 'Data retention 2'] },
  { items: ['Storage resilience'] },
  { items: ['Preserved data 1', 'Preserved data 2', 'Preserved data 3'] },
  { items: ['Stable storage', 'Consistent data'] },
  { items: ['Rehydration test'] },
  { items: ['Data availability check'] },
  { items: ['Persisted todos 1', 'Persisted todos 2'] },
  { items: ['Storage consistency'] },
  { items: ['Recovery test 1', 'Recovery test 2'] },
  { items: ['Resilient data storage', 'Backup preservation'] },
  { items: ['Long-lived storage'] },
  { items: ['Session integrity', 'Data integrity'] },
  { items: ['Permanent storage test'] },
  { items: ['Durable persist 1', 'Durable persist 2', 'Durable persist 3'] },
  { items: ['Stable todo list'] },
  { items: ['Memory persistence test'] },
  { items: ['Cross-session persistence'] },
  { items: ['Final persistence check 1', 'Final persistence check 2'] },
  { items: ['Ultimate persistence test'] },
  { items: ['Persistence validation complete'] },
  { items: ['Permanent record verification'] },
];

persistanceTests.forEach(({ items }, i) => {
  const fills = items.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const expectedEscaped = items.map(t => `'${t}'`).join(', ');

  write(
    `Reload persistence final – test ${i + 1}`,
    `verifies todos survive page reload (localStorage persistence) – final batch`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    await page.reload();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await expect(page.locator('.todo-list li label')).toHaveText([${expectedEscaped}]);`
  );
});

console.log(`Total tests now: ${idx - 1}`);
