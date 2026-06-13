#!/usr/bin/env node
// Generates 100 meaningful Playwright tests across 10 TodoMVC scenario groups.
// Run: node scripts/generate-meaningful-tests.js

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../tests/generated');
const BASE_URL = 'https://demo.playwright.dev/todomvc';

// Remove all existing generated spec files
const existing = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.spec.ts'));
existing.forEach(f => fs.unlinkSync(path.join(OUT_DIR, f)));
console.log(`Removed ${existing.length} old generated files.`);

let idx = 1;
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

// ─── Group 1: Add a single todo (001–010) ────────────────────────────────────
const singleTodos = [
  'Learn Playwright end-to-end testing',
  'Write unit tests for auth module',
  'Review open pull requests',
  'Fix critical bug in checkout flow',
  'Update API documentation',
  'Deploy feature branch to staging',
  'Run full regression suite',
  'Refactor the login module',
  'Set up GitHub Actions CI pipeline',
  'Conduct peer code review session',
];

singleTodos.forEach((todo, i) => {
  write(
    `Add single todo – variant ${i + 1}`,
    `adds "${todo}" and verifies it appears in the list`,
    `    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('${todo}');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['${todo}']);
    await expect(page.locator('.todo-count')).toContainText('1 item');`
  );
});

// ─── Group 2: Add multiple todos and verify count (011–020) ───────────────────
const multiSets = [
  ['Buy groceries', 'Call dentist', 'Pay bills'],
  ['Morning standup', 'Sprint planning', 'Retrospective meeting'],
  ['Read emails', 'Reply to clients', 'Update Jira ticket'],
  ['Write feature tests', 'Fix ESLint warnings', 'Submit pull request'],
  ['Cook dinner', 'Do laundry', 'Clean the house'],
  ['Study React hooks', 'Practice TypeScript generics', 'Build demo app'],
  ['Set up database schema', 'Write migration script', 'Test rollback path'],
  ['Create UI mockup', 'Gather design feedback', 'Implement component'],
  ['Monitor production alerts', 'Review dashboards', 'Update runbook'],
  ['Plan next sprint', 'Assign tasks to team', 'Set delivery deadlines'],
];

multiSets.forEach((todos, i) => {
  const escaped = todos.map(t => `'${t}'`).join(', ');
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');

  write(
    `Add multiple todos – variant ${i + 1}`,
    `adds ${todos.length} todos and verifies count`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    await expect(page.locator('.todo-list li label')).toHaveText([${escaped}]);
    await expect(page.locator('.todo-count')).toContainText('${todos.length} item');`
  );
});

// ─── Group 3: Complete a todo (021–030) ───────────────────────────────────────
const completeSets = [
  { todos: ['Send report', 'Review slides'], complete: 'Send report' },
  { todos: ['Write tests', 'Fix bug', 'Deploy'], complete: 'Fix bug' },
  { todos: ['Morning run', 'Meditate', 'Journal'], complete: 'Meditate' },
  { todos: ['Read book', 'Take notes', 'Summarise'], complete: 'Take notes' },
  { todos: ['Plan week', 'Set goals', 'Review OKRs'], complete: 'Set goals' },
  { todos: ['Refactor service', 'Add logging', 'Write docs'], complete: 'Add logging' },
  { todos: ['Design schema', 'Review ERD', 'Migrate data'], complete: 'Review ERD' },
  { todos: ['Draft email', 'Proofread', 'Send to team'], complete: 'Proofread' },
  { todos: ['Setup environment', 'Install deps', 'Run tests'], complete: 'Install deps' },
  { todos: ['Create branch', 'Implement feature', 'Open PR'], complete: 'Create branch' },
];

completeSets.forEach(({ todos, complete }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');

  write(
    `Complete a todo – variant ${i + 1}`,
    `marks "${complete}" as completed`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    const targetItem = page.locator('.todo-list li').filter({ hasText: '${complete}' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);`
  );
});

// ─── Group 4: Delete a todo (031–040) ─────────────────────────────────────────
const deleteSets = [
  { todos: ['Keep this', 'Delete this'], remove: 'Delete this', remaining: ['Keep this'] },
  { todos: ['Alpha', 'Beta', 'Gamma'], remove: 'Beta', remaining: ['Alpha', 'Gamma'] },
  { todos: ['Task A', 'Task B', 'Task C'], remove: 'Task A', remaining: ['Task B', 'Task C'] },
  { todos: ['Read', 'Write', 'Publish'], remove: 'Publish', remaining: ['Read', 'Write'] },
  { todos: ['Plan', 'Execute', 'Review'], remove: 'Execute', remaining: ['Plan', 'Review'] },
  { todos: ['Draft', 'Edit', 'Approve'], remove: 'Draft', remaining: ['Edit', 'Approve'] },
  { todos: ['Design', 'Build', 'Test'], remove: 'Test', remaining: ['Design', 'Build'] },
  { todos: ['Analyse', 'Report', 'Present'], remove: 'Report', remaining: ['Analyse', 'Present'] },
  { todos: ['Research', 'Prototype', 'Demo'], remove: 'Prototype', remaining: ['Research', 'Demo'] },
  { todos: ['Propose', 'Agree', 'Deliver'], remove: 'Agree', remaining: ['Propose', 'Deliver'] },
];

deleteSets.forEach(({ todos, remove, remaining }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const remainingEscaped = remaining.map(t => `'${t}'`).join(', ');

  write(
    `Delete a todo – variant ${i + 1}`,
    `deletes "${remove}" and verifies the remaining list`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    const targetItem = page.locator('.todo-list li').filter({ hasText: '${remove}' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText([${remainingEscaped}]);`
  );
});

// ─── Group 5: Filter – Active view (041–050) ──────────────────────────────────
const activeFilterSets = [
  { todos: ['Active item', 'Done item'], complete: ['Done item'], active: ['Active item'] },
  { todos: ['Task 1', 'Task 2', 'Task 3'], complete: ['Task 2'], active: ['Task 1', 'Task 3'] },
  { todos: ['Read', 'Write', 'Publish'], complete: ['Read'], active: ['Write', 'Publish'] },
  { todos: ['Sprint task', 'Backlog item', 'Bug fix'], complete: ['Bug fix'], active: ['Sprint task', 'Backlog item'] },
  { todos: ['Meeting prep', 'Follow up', 'Send agenda'], complete: ['Send agenda'], active: ['Meeting prep', 'Follow up'] },
  { todos: ['Code review', 'Unit tests', 'Deploy'], complete: ['Unit tests'], active: ['Code review', 'Deploy'] },
  { todos: ['Draft spec', 'Review spec', 'Sign off'], complete: ['Draft spec', 'Review spec'], active: ['Sign off'] },
  { todos: ['UI work', 'API work', 'DB work'], complete: ['DB work'], active: ['UI work', 'API work'] },
  { todos: ['Monday task', 'Tuesday task', 'Wednesday task'], complete: ['Monday task'], active: ['Tuesday task', 'Wednesday task'] },
  { todos: ['Phase 1', 'Phase 2', 'Phase 3'], complete: ['Phase 1', 'Phase 2'], active: ['Phase 3'] },
];

activeFilterSets.forEach(({ todos, complete, active }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const completeActions = complete.map(t =>
    `    await page.locator('.todo-list li').filter({ hasText: '${t}' }).locator('input.toggle').click();`
  ).join('\n');
  const activeEscaped = active.map(t => `'${t}'`).join(', ');

  write(
    `Filter active todos – variant ${i + 1}`,
    `shows only active todos after completing ${complete.length} item(s)`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

${completeActions}

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText([${activeEscaped}]);`
  );
});

// ─── Group 6: Filter – Completed view (051–060) ───────────────────────────────
const completedFilterSets = [
  { todos: ['Todo A', 'Todo B'], complete: ['Todo B'], completed: ['Todo B'] },
  { todos: ['Item 1', 'Item 2', 'Item 3'], complete: ['Item 1', 'Item 3'], completed: ['Item 1', 'Item 3'] },
  { todos: ['Alpha', 'Beta', 'Gamma'], complete: ['Alpha'], completed: ['Alpha'] },
  { todos: ['Backlog', 'In progress', 'Done'], complete: ['Done'], completed: ['Done'] },
  { todos: ['Draft', 'Review', 'Published'], complete: ['Draft', 'Review'], completed: ['Draft', 'Review'] },
  { todos: ['Step 1', 'Step 2', 'Step 3'], complete: ['Step 2'], completed: ['Step 2'] },
  { todos: ['Login page', 'Dashboard', 'Settings'], complete: ['Login page'], completed: ['Login page'] },
  { todos: ['Research', 'Implement', 'Test'], complete: ['Research', 'Test'], completed: ['Research', 'Test'] },
  { todos: ['Feature A', 'Feature B', 'Feature C'], complete: ['Feature A', 'Feature B'], completed: ['Feature A', 'Feature B'] },
  { todos: ['Morning', 'Afternoon', 'Evening'], complete: ['Morning', 'Evening'], completed: ['Morning', 'Evening'] },
];

completedFilterSets.forEach(({ todos, complete, completed }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const completeActions = complete.map(t =>
    `    await page.locator('.todo-list li').filter({ hasText: '${t}' }).locator('input.toggle').click();`
  ).join('\n');
  const completedEscaped = completed.map(t => `'${t}'`).join(', ');

  write(
    `Filter completed todos – variant ${i + 1}`,
    `shows only completed todos in Completed filter view`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

${completeActions}

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText([${completedEscaped}]);`
  );
});

// ─── Group 7: Inline edit (061–070) ───────────────────────────────────────────
const editSets = [
  { original: 'Original task', updated: 'Updated task text' },
  { original: 'Fix typo in readme', updated: 'Fix typo in README.md' },
  { original: 'Write tets', updated: 'Write tests' },
  { original: 'Implemet feature', updated: 'Implement feature' },
  { original: 'Review PR asap', updated: 'Review PR before EOD' },
  { original: 'Update depndencies', updated: 'Update dependencies' },
  { original: 'Deply to prod', updated: 'Deploy to production' },
  { original: 'Schedule meeing', updated: 'Schedule team meeting' },
  { original: 'Prepare relase notes', updated: 'Prepare release notes' },
  { original: 'Run smoke tsts', updated: 'Run smoke tests' },
];

editSets.forEach(({ original, updated }, i) => {
  write(
    `Inline edit todo – variant ${i + 1}`,
    `edits "${original}" to "${updated}"`,
    `    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('${original}');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    const label = todoItem.locator('label');
    await label.dblclick();

    const editor = todoItem.locator('.edit');
    await editor.fill('${updated}');
    await editor.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['${updated}']);`
  );
});

// ─── Group 8: Toggle all (071–080) ────────────────────────────────────────────
const toggleAllSets = [
  ['Task one', 'Task two'],
  ['Alpha', 'Beta', 'Gamma'],
  ['Read', 'Write', 'Publish'],
  ['Design', 'Develop', 'Test', 'Deploy'],
  ['Q1 goal', 'Q2 goal', 'Q3 goal'],
  ['Frontend', 'Backend', 'Database'],
  ['Plan', 'Execute', 'Review'],
  ['Research', 'Prototype', 'Build'],
  ['Draft', 'Review', 'Approve', 'Publish'],
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
];

toggleAllSets.forEach((todos, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');

  write(
    `Toggle all todos – variant ${i + 1}`,
    `marks all ${todos.length} todos as completed with toggle-all`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    await page.locator('.toggle-all').check();

    const toggles = page.locator('.todo-list li input.toggle');
    const count = await toggles.count();
    for (let i = 0; i < count; i++) {
      await expect(toggles.nth(i)).toBeChecked();
    }`
  );
});

// ─── Group 9: Clear completed (081–090) ───────────────────────────────────────
const clearSets = [
  { todos: ['Done task', 'Active task'], complete: ['Done task'], remaining: ['Active task'] },
  { todos: ['Finished A', 'Ongoing B', 'Finished C'], complete: ['Finished A', 'Finished C'], remaining: ['Ongoing B'] },
  { todos: ['Old bug fix', 'New feature', 'Closed ticket'], complete: ['Old bug fix', 'Closed ticket'], remaining: ['New feature'] },
  { todos: ['Merged PR', 'Open issue', 'Closed issue'], complete: ['Merged PR', 'Closed issue'], remaining: ['Open issue'] },
  { todos: ['Shipped feature', 'In review', 'Deployed hotfix'], complete: ['Shipped feature', 'Deployed hotfix'], remaining: ['In review'] },
  { todos: ['Completed sprint', 'New backlog', 'Done epic'], complete: ['Completed sprint', 'Done epic'], remaining: ['New backlog'] },
  { todos: ['Released v1', 'Plan v2', 'Fix regression'], complete: ['Released v1'], remaining: ['Plan v2', 'Fix regression'] },
  { todos: ['Closed deal', 'New prospect', 'Sent proposal'], complete: ['Closed deal', 'Sent proposal'], remaining: ['New prospect'] },
  { todos: ['Submitted report', 'Draft report', 'Archive data'], complete: ['Submitted report', 'Archive data'], remaining: ['Draft report'] },
  { todos: ['Resolved incident', 'Monitor metrics', 'Update docs'], complete: ['Resolved incident', 'Update docs'], remaining: ['Monitor metrics'] },
];

clearSets.forEach(({ todos, complete, remaining }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const completeActions = complete.map(t =>
    `    await page.locator('.todo-list li').filter({ hasText: '${t}' }).locator('input.toggle').click();`
  ).join('\n');
  const remainingEscaped = remaining.map(t => `'${t}'`).join(', ');

  write(
    `Clear completed todos – variant ${i + 1}`,
    `clears ${complete.length} completed todo(s) and verifies remaining`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

${completeActions}

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText([${remainingEscaped}]);`
  );
});

// ─── Group 10: Reload persistence (091–100) ───────────────────────────────────
const persistSets = [
  ['Remember me'],
  ['Survive reload'],
  ['Persist after refresh', 'Also this one'],
  ['LocalStorage test'],
  ['Session survivor A', 'Session survivor B'],
  ['Reload check 1', 'Reload check 2', 'Reload check 3'],
  ['Sticky task'],
  ['Durable item A', 'Durable item B'],
  ['Persisted todo'],
  ['Long-lived task', 'Another persistent task'],
];

persistSets.forEach((todos, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const expectedEscaped = todos.map(t => `'${t}'`).join(', ');

  write(
    `Reload persistence – variant ${i + 1}`,
    `todos survive a page reload (localStorage persistence)`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    await page.reload();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    await expect(page.locator('.todo-list li label')).toHaveText([${expectedEscaped}]);`
  );
});

console.log(`Generated ${idx - 1} meaningful test files in ${OUT_DIR}`);
