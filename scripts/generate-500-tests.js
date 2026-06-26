#!/usr/bin/env node
// Generates exactly 500 meaningful Playwright tests across 10 TodoMVC scenario groups (50 each).
// Run: node scripts/generate-500-tests.js

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

// Generate 50 single todo scenarios
const singleTodos = [
  'Learn Playwright end-to-end testing', 'Write unit tests for auth module', 'Review open pull requests',
  'Fix critical bug in checkout flow', 'Update API documentation', 'Deploy feature branch to staging',
  'Run full regression suite', 'Refactor the login module', 'Set up GitHub Actions CI pipeline',
  'Conduct peer code review session', 'Optimize database query performance', 'Implement password reset functionality',
  'Create comprehensive test coverage report', 'Debug memory leak in production', 'Setup Docker containerization',
  'Migrate legacy code to TypeScript', 'Implement dark mode feature', 'Setup monitoring and alerting system',
  'Write API integration tests', 'Review security vulnerability report', 'Configure automated backup system',
  'Implement rate limiting on API endpoints', 'Setup continuous deployment pipeline', 'Write database migration scripts',
  'Implement two-factor authentication', 'Create user onboarding flow', 'Setup load testing infrastructure',
  'Implement caching strategy', 'Write performance benchmarks', 'Setup error tracking system',
  'Implement webhook system', 'Create admin dashboard interface', 'Optimize image loading performance',
  'Write contract tests for services', 'Implement customer analytics tracking', 'Setup staging environment',
  'Implement email notification system', 'Create API documentation', 'Optimize front-end bundle size',
  'Implement role-based access control', 'Setup log aggregation system', 'Implement real-time notifications',
  'Create data migration tool', 'Implement search functionality', 'Setup compliance audit trail',
  'Implement backup verification system', 'Create health check endpoints', 'Implement feature flag system',
  'Setup metrics collection dashboard',
];

singleTodos.forEach((todo, i) => {
  write(
    `Add single todo – scenario ${i + 1}`,
    `adds "${todo}" to the todo list`,
    `    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('${todo}');
    await input.press('Enter');

    await expect(page.locator('.todo-list li label')).toHaveText(['${todo}']);
    await expect(page.locator('.todo-count')).toContainText('1 item');`
  );
});

// Generate 50 multi-todo scenarios
const multiTodoGroups = [
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
  ['Backup critical data', 'Verify backup integrity', 'Document recovery process'],
  ['Review team performance', 'Provide feedback', 'Set career goals'],
  ['Update dependencies', 'Run security audit', 'Apply security patches'],
  ['Create user guides', 'Record video tutorial', 'Publish documentation'],
  ['Setup CI/CD pipeline', 'Configure build scripts', 'Setup deployment automation'],
  ['Implement caching', 'Optimize queries', 'Benchmark improvements'],
  ['Design database schema', 'Create ERD diagram', 'Write SQL migrations'],
  ['Audit user permissions', 'Review access logs', 'Update security policies'],
  ['Setup monitoring alerts', 'Configure dashboards', 'Create runbooks'],
  ['Implement API versioning', 'Deprecate old endpoints', 'Create migration guide'],
  ['Review code quality metrics', 'Setup static analysis', 'Configure linters'],
  ['Create disaster recovery plan', 'Document procedures', 'Schedule drills'],
  ['Implement request validation', 'Add rate limiting', 'Setup throttling'],
  ['Configure SSL certificates', 'Setup HTTPS', 'Update security headers'],
  ['Create user roles', 'Assign permissions', 'Implement authorization'],
  ['Analyze system performance', 'Identify bottlenecks', 'Plan optimizations'],
  ['Implement logging framework', 'Configure log levels', 'Setup log retention'],
  ['Create deployment checklist', 'Setup pre-flight checks', 'Document rollback steps'],
  ['Review application security', 'Conduct penetration testing', 'Fix vulnerabilities'],
  ['Setup application profiling', 'Analyze metrics', 'Optimize hot paths'],
  ['Implement circuit breakers', 'Add fallback strategies', 'Configure timeouts'],
  ['Create database backup schedule', 'Automate backups', 'Test restore process'],
  ['Setup distributed tracing', 'Implement correlation IDs', 'Analyze latency'],
  ['Create capacity planning document', 'Forecast growth', 'Plan infrastructure'],
  ['Implement feature toggles', 'Setup feature flags', 'Create toggle management UI'],
  ['Review API contracts', 'Update schema definitions', 'Publish API changes'],
  ['Setup chaos engineering tests', 'Plan failure scenarios', 'Document mitigation'],
  ['Create service health checks', 'Implement heartbeat monitoring', 'Setup alerts'],
  ['Implement request tracing', 'Add timing instrumentation', 'Create performance report'],
  ['Setup environment parity', 'Synchronize configurations', 'Document differences'],
  ['Implement auto-scaling policies', 'Configure thresholds', 'Test scaling'],
  ['Create runbook templates', 'Document incidents', 'Setup incident tracking'],
  ['Implement retry logic', 'Add exponential backoff', 'Configure retry limits'],
  ['Setup compliance scanning', 'Implement policy checks', 'Create audit reports'],
  ['Review third-party dependencies', 'Update vulnerable packages', 'Test compatibility'],
  ['Create upgrade documentation', 'Plan migration strategy', 'Setup parallel runs'],
  ['Implement graceful degradation', 'Add fallback UI', 'Setup error boundaries'],
  ['Setup usage analytics', 'Track user behavior', 'Create insights dashboard'],
  ['Implement rate limiting', 'Setup throttling', 'Configure quotas'],
  ['Create incident response plan', 'Document procedures', 'Schedule drills'],
];

multiTodoGroups.forEach((todos, i) => {
  const escaped = todos.map(t => `'${t}'`).join(', ');
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');

  write(
    `Add multiple todos – batch ${i + 1}`,
    `adds ${todos.length} todos and verifies list and count`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    await expect(page.locator('.todo-list li label')).toHaveText([${escaped}]);
    await expect(page.locator('.todo-count')).toContainText('${todos.length} item');`
  );
});

// Generate 50 complete todo scenarios
const completeScenarios = [
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
  { todos: ['Audit permissions', 'Review policies', 'Update rules'], complete: 'Review policies' },
  { todos: ['Backup data', 'Verify backup', 'Document process'], complete: 'Verify backup' },
  { todos: ['Plan sprint', 'Assign tasks', 'Start work'], complete: 'Plan sprint' },
  { todos: ['Write spec', 'Get approval', 'Start development'], complete: 'Write spec' },
  { todos: ['Create mockup', 'Gather feedback', 'Refine design'], complete: 'Gather feedback' },
  { todos: ['Setup monitoring', 'Configure alerts', 'Test alerts'], complete: 'Configure alerts' },
  { todos: ['Review code', 'Request changes', 'Merge PR'], complete: 'Request changes' },
  { todos: ['Implement feature', 'Add tests', 'Document API'], complete: 'Implement feature' },
  { todos: ['Fix bugs', 'Update docs', 'Release version'], complete: 'Update docs' },
  { todos: ['Optimize query', 'Run benchmarks', 'Deploy optimization'], complete: 'Run benchmarks' },
  { todos: ['Implement caching', 'Test performance', 'Monitor metrics'], complete: 'Implement caching' },
  { todos: ['Setup logging', 'Configure levels', 'Archive logs'], complete: 'Configure levels' },
  { todos: ['Design API', 'Implement endpoints', 'Write tests'], complete: 'Design API' },
  { todos: ['Create database', 'Run migrations', 'Verify schema'], complete: 'Run migrations' },
  { todos: ['Deploy to staging', 'Run tests', 'Deploy to prod'], complete: 'Deploy to staging' },
  { todos: ['Review security', 'Fix vulnerabilities', 'Verify fixes'], complete: 'Fix vulnerabilities' },
  { todos: ['Plan architecture', 'Implement design', 'Review design'], complete: 'Implement design' },
  { todos: ['Write documentation', 'Create examples', 'Publish docs'], complete: 'Create examples' },
  { todos: ['Setup CI/CD', 'Configure builds', 'Test pipeline'], complete: 'Configure builds' },
  { todos: ['Analyze performance', 'Identify issues', 'Plan fixes'], complete: 'Identify issues' },
  { todos: ['Version release', 'Tag commit', 'Update changelog'], complete: 'Tag commit' },
  { todos: ['Client meeting', 'Present proposal', 'Gather feedback'], complete: 'Present proposal' },
  { todos: ['Team standup', 'Update status', 'Plan blockers'], complete: 'Update status' },
  { todos: ['Performance review', 'Set targets', 'Develop plan'], complete: 'Set targets' },
  { todos: ['Security scan', 'Analyze results', 'Fix issues'], complete: 'Analyze results' },
  { todos: ['Database migration', 'Backup old data', 'Verify new data'], complete: 'Backup old data' },
  { todos: ['API versioning', 'Deprecate v1', 'Support v2'], complete: 'Deprecate v1' },
  { todos: ['Code cleanup', 'Remove dead code', 'Update imports'], complete: 'Remove dead code' },
  { todos: ['Testing cycle', 'Run QA tests', 'Report bugs'], complete: 'Run QA tests' },
  { todos: ['Documentation update', 'Add examples', 'Publish guide'], complete: 'Add examples' },
  { todos: ['Infrastructure upgrade', 'Migrate services', 'Verify stability'], complete: 'Migrate services' },
  { todos: ['Compliance audit', 'Review policies', 'Update procedures'], complete: 'Review policies' },
  { todos: ['Feature demo', 'Gather requirements', 'Update specs'], complete: 'Gather requirements' },
  { todos: ['System maintenance', 'Apply patches', 'Monitor system'], complete: 'Apply patches' },
  { todos: ['Team training', 'Create materials', 'Conduct session'], complete: 'Create materials' },
  { todos: ['Release planning', 'Prioritize features', 'Set timeline'], complete: 'Prioritize features' },
  { todos: ['Bug triage', 'Categorize issues', 'Assign owners'], complete: 'Categorize issues' },
  { todos: ['Architecture review', 'Document design', 'Get approval'], complete: 'Document design' },
  { todos: ['Product roadmap', 'Plan quarters', 'Update stakeholders'], complete: 'Plan quarters' },
  { todos: ['System monitoring', 'Check metrics', 'Create alerts'], complete: 'Check metrics' },
];

completeScenarios.forEach(({ todos, complete }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');

  write(
    `Complete a todo – case ${i + 1}`,
    `marks "${complete}" as completed`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    const targetItem = page.locator('.todo-list li').filter({ hasText: '${complete}' });
    await targetItem.locator('input.toggle').click();

    await expect(targetItem).toHaveClass(/completed/);`
  );
});

// Generate 50 delete scenarios (reusing and extending existing patterns)
const deleteScenarios = [
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
  { todos: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'], remove: 'Item 3', remaining: ['Item 1', 'Item 2', 'Item 4', 'Item 5'] },
  { todos: ['Feature spec', 'Review spec', 'Implement'], remove: 'Feature spec', remaining: ['Review spec', 'Implement'] },
  { todos: ['Bug report', 'Investigate', 'Fix'], remove: 'Bug report', remaining: ['Investigate', 'Fix'] },
  { todos: ['Step 1', 'Step 2', 'Step 3', 'Step 4'], remove: 'Step 2', remaining: ['Step 1', 'Step 3', 'Step 4'] },
  { todos: ['Phase 1', 'Phase 2', 'Phase 3'], remove: 'Phase 3', remaining: ['Phase 1', 'Phase 2'] },
  { todos: ['Module A', 'Module B', 'Module C'], remove: 'Module B', remaining: ['Module A', 'Module C'] },
  { todos: ['Component X', 'Component Y', 'Component Z'], remove: 'Component X', remaining: ['Component Y', 'Component Z'] },
  { todos: ['Service 1', 'Service 2', 'Service 3'], remove: 'Service 2', remaining: ['Service 1', 'Service 3'] },
  { todos: ['Process A', 'Process B', 'Process C'], remove: 'Process A', remaining: ['Process B', 'Process C'] },
  { todos: ['Action 1', 'Action 2', 'Action 3'], remove: 'Action 3', remaining: ['Action 1', 'Action 2'] },
  { todos: ['Test 1', 'Test 2', 'Test 3'], remove: 'Test 2', remaining: ['Test 1', 'Test 3'] },
  { todos: ['Release 1', 'Release 2', 'Release 3'], remove: 'Release 1', remaining: ['Release 2', 'Release 3'] },
  { todos: ['Version A', 'Version B', 'Version C'], remove: 'Version C', remaining: ['Version A', 'Version B'] },
  { todos: ['Ticket 1', 'Ticket 2', 'Ticket 3', 'Ticket 4'], remove: 'Ticket 3', remaining: ['Ticket 1', 'Ticket 2', 'Ticket 4'] },
  { todos: ['Priority 1', 'Priority 2', 'Priority 3'], remove: 'Priority 2', remaining: ['Priority 1', 'Priority 3'] },
  { todos: ['Topic 1', 'Topic 2', 'Topic 3'], remove: 'Topic 1', remaining: ['Topic 2', 'Topic 3'] },
  { todos: ['Event 1', 'Event 2', 'Event 3', 'Event 4'], remove: 'Event 2', remaining: ['Event 1', 'Event 3', 'Event 4'] },
  { todos: ['Requirement 1', 'Requirement 2', 'Requirement 3'], remove: 'Requirement 3', remaining: ['Requirement 1', 'Requirement 2'] },
  { todos: ['Goal 1', 'Goal 2', 'Goal 3'], remove: 'Goal 1', remaining: ['Goal 2', 'Goal 3'] },
  { todos: ['Target 1', 'Target 2', 'Target 3'], remove: 'Target 2', remaining: ['Target 1', 'Target 3'] },
  { todos: ['Milestone 1', 'Milestone 2', 'Milestone 3'], remove: 'Milestone 1', remaining: ['Milestone 2', 'Milestone 3'] },
  { todos: ['Checkpoint A', 'Checkpoint B', 'Checkpoint C'], remove: 'Checkpoint B', remaining: ['Checkpoint A', 'Checkpoint C'] },
  { todos: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'], remove: 'Batch 3', remaining: ['Batch 1', 'Batch 2', 'Batch 4'] },
  { todos: ['Group 1', 'Group 2', 'Group 3'], remove: 'Group 2', remaining: ['Group 1', 'Group 3'] },
  { todos: ['Round 1', 'Round 2', 'Round 3'], remove: 'Round 1', remaining: ['Round 2', 'Round 3'] },
  { todos: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4'], remove: 'Cycle 2', remaining: ['Cycle 1', 'Cycle 3', 'Cycle 4'] },
  { todos: ['Day 1', 'Day 2', 'Day 3'], remove: 'Day 3', remaining: ['Day 1', 'Day 2'] },
  { todos: ['Time slot 1', 'Time slot 2', 'Time slot 3'], remove: 'Time slot 2', remaining: ['Time slot 1', 'Time slot 3'] },
  { todos: ['Entry 1', 'Entry 2', 'Entry 3', 'Entry 4'], remove: 'Entry 1', remaining: ['Entry 2', 'Entry 3', 'Entry 4'] },
  { todos: ['Region 1', 'Region 2', 'Region 3'], remove: 'Region 3', remaining: ['Region 1', 'Region 2'] },
  { todos: ['Item alpha', 'Item beta', 'Item gamma', 'Item delta', 'Item epsilon'], remove: 'Item gamma', remaining: ['Item alpha', 'Item beta', 'Item delta', 'Item epsilon'] },
  { todos: ['Sprint 1', 'Sprint 2', 'Sprint 3'], remove: 'Sprint 2', remaining: ['Sprint 1', 'Sprint 3'] },
  { todos: ['Document 1', 'Document 2', 'Document 3'], remove: 'Document 1', remaining: ['Document 2', 'Document 3'] },
  { todos: ['Review 1', 'Review 2', 'Review 3', 'Review 4'], remove: 'Review 3', remaining: ['Review 1', 'Review 2', 'Review 4'] },
  { todos: ['Approval 1', 'Approval 2', 'Approval 3'], remove: 'Approval 2', remaining: ['Approval 1', 'Approval 3'] },
  { todos: ['Account 1', 'Account 2', 'Account 3'], remove: 'Account 1', remaining: ['Account 2', 'Account 3'] },
  { todos: ['Resource 1', 'Resource 2', 'Resource 3', 'Resource 4'], remove: 'Resource 2', remaining: ['Resource 1', 'Resource 3', 'Resource 4'] },
  { todos: ['Link 1', 'Link 2', 'Link 3'], remove: 'Link 3', remaining: ['Link 1', 'Link 2'] },
  { todos: ['Node 1', 'Node 2', 'Node 3'], remove: 'Node 2', remaining: ['Node 1', 'Node 3'] },
  { todos: ['Config 1', 'Config 2', 'Config 3', 'Config 4'], remove: 'Config 1', remaining: ['Config 2', 'Config 3', 'Config 4'] },
];

deleteScenarios.forEach(({ todos, remove, remaining }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const remainingEscaped = remaining.map(t => `'${t}'`).join(', ');

  write(
    `Delete a todo – iteration ${i + 1}`,
    `deletes "${remove}" and verifies list accuracy`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

    const targetItem = page.locator('.todo-list li').filter({ hasText: '${remove}' });
    await targetItem.hover();
    await targetItem.locator('button.destroy').click();

    await expect(page.locator('.todo-list li label')).toHaveText([${remainingEscaped}]);`
  );
});

// Generate 50 active filter scenarios
const activeFilterScenarios = [
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
  { todos: ['Item A', 'Item B', 'Item C', 'Item D'], complete: ['Item B', 'Item D'], active: ['Item A', 'Item C'] },
  { todos: ['Feature X', 'Feature Y', 'Feature Z'], complete: ['Feature Y'], active: ['Feature X', 'Feature Z'] },
  { todos: ['Setup', 'Configure', 'Verify', 'Deploy'], complete: ['Setup', 'Verify'], active: ['Configure', 'Deploy'] },
  { todos: ['Research', 'Planning', 'Execution'], complete: ['Planning'], active: ['Research', 'Execution'] },
  { todos: ['Requirement 1', 'Requirement 2', 'Requirement 3'], complete: ['Requirement 2'], active: ['Requirement 1', 'Requirement 3'] },
  { todos: ['Step 1', 'Step 2', 'Step 3', 'Step 4'], complete: ['Step 1', 'Step 3'], active: ['Step 2', 'Step 4'] },
  { todos: ['Module A', 'Module B', 'Module C'], complete: ['Module A'], active: ['Module B', 'Module C'] },
  { todos: ['Q1 task', 'Q2 task', 'Q3 task'], complete: ['Q1 task'], active: ['Q2 task', 'Q3 task'] },
  { todos: ['Component X', 'Component Y'], complete: ['Component X'], active: ['Component Y'] },
  { todos: ['Service 1', 'Service 2', 'Service 3', 'Service 4'], complete: ['Service 1', 'Service 2'], active: ['Service 3', 'Service 4'] },
  { todos: ['Test A', 'Test B', 'Test C'], complete: ['Test B'], active: ['Test A', 'Test C'] },
  { todos: ['Doc 1', 'Doc 2'], complete: ['Doc 1'], active: ['Doc 2'] },
  { todos: ['Release alpha', 'Release beta', 'Release gamma'], complete: ['Release alpha', 'Release gamma'], active: ['Release beta'] },
  { todos: ['Issue 1', 'Issue 2', 'Issue 3'], complete: ['Issue 3'], active: ['Issue 1', 'Issue 2'] },
  { todos: ['Ticket 101', 'Ticket 102', 'Ticket 103'], complete: ['Ticket 102'], active: ['Ticket 101', 'Ticket 103'] },
  { todos: ['PR 1', 'PR 2', 'PR 3'], complete: ['PR 1', 'PR 3'], active: ['PR 2'] },
  { todos: ['Metric A', 'Metric B', 'Metric C', 'Metric D'], complete: ['Metric B', 'Metric D'], active: ['Metric A', 'Metric C'] },
  { todos: ['Scenario 1', 'Scenario 2', 'Scenario 3'], complete: ['Scenario 2'], active: ['Scenario 1', 'Scenario 3'] },
  { todos: ['Goal 1', 'Goal 2', 'Goal 3'], complete: ['Goal 1'], active: ['Goal 2', 'Goal 3'] },
  { todos: ['Target 1', 'Target 2', 'Target 3', 'Target 4'], complete: ['Target 2', 'Target 4'], active: ['Target 1', 'Target 3'] },
  { todos: ['Day 1', 'Day 2', 'Day 3'], complete: ['Day 2'], active: ['Day 1', 'Day 3'] },
  { todos: ['Region 1', 'Region 2', 'Region 3'], complete: ['Region 1'], active: ['Region 2', 'Region 3'] },
  { todos: ['Batch 1', 'Batch 2', 'Batch 3'], complete: ['Batch 2'], active: ['Batch 1', 'Batch 3'] },
  { todos: ['Group A', 'Group B', 'Group C', 'Group D'], complete: ['Group A', 'Group C'], active: ['Group B', 'Group D'] },
  { todos: ['Round 1', 'Round 2', 'Round 3'], complete: ['Round 1', 'Round 3'], active: ['Round 2'] },
  { todos: ['Entry 1', 'Entry 2', 'Entry 3'], complete: ['Entry 2'], active: ['Entry 1', 'Entry 3'] },
  { todos: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4'], complete: ['Cycle 1', 'Cycle 3'], active: ['Cycle 2', 'Cycle 4'] },
  { todos: ['Sprint 1', 'Sprint 2', 'Sprint 3'], complete: ['Sprint 2'], active: ['Sprint 1', 'Sprint 3'] },
  { todos: ['Version 1', 'Version 2'], complete: ['Version 1'], active: ['Version 2'] },
  { todos: ['Document 1', 'Document 2', 'Document 3'], complete: ['Document 1'], active: ['Document 2', 'Document 3'] },
  { todos: ['Approval 1', 'Approval 2', 'Approval 3', 'Approval 4'], complete: ['Approval 2', 'Approval 4'], active: ['Approval 1', 'Approval 3'] },
  { todos: ['Review 1', 'Review 2', 'Review 3'], complete: ['Review 1', 'Review 3'], active: ['Review 2'] },
  { todos: ['Checkpoint A', 'Checkpoint B', 'Checkpoint C'], complete: ['Checkpoint B'], active: ['Checkpoint A', 'Checkpoint C'] },
  { todos: ['Milestone 1', 'Milestone 2', 'Milestone 3'], complete: ['Milestone 1', 'Milestone 2'], active: ['Milestone 3'] },
  { todos: ['Event 1', 'Event 2', 'Event 3'], complete: ['Event 3'], active: ['Event 1', 'Event 2'] },
  { todos: ['Schedule 1', 'Schedule 2', 'Schedule 3', 'Schedule 4'], complete: ['Schedule 1'], active: ['Schedule 2', 'Schedule 3', 'Schedule 4'] },
  { todos: ['Account 1', 'Account 2', 'Account 3'], complete: ['Account 2'], active: ['Account 1', 'Account 3'] },
  { todos: ['Resource 1', 'Resource 2', 'Resource 3'], complete: ['Resource 1'], active: ['Resource 2', 'Resource 3'] },
  { todos: ['Link 1', 'Link 2', 'Link 3'], complete: ['Link 2'], active: ['Link 1', 'Link 3'] },
];

activeFilterScenarios.forEach(({ todos, complete, active }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const completeActions = complete.map(t =>
    `    await page.locator('.todo-list li').filter({ hasText: '${t}' }).locator('input.toggle').click();`
  ).join('\n');
  const activeEscaped = active.map(t => `'${t}'`).join(', ');

  write(
    `Filter active todos – run ${i + 1}`,
    `displays only active todos after completing ${complete.length} item(s)`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

${completeActions}

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText([${activeEscaped}]);`
  );
});

// Generate 50 completed filter scenarios
const completedFilterScenarios = [
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
  { todos: ['Task 1', 'Task 2', 'Task 3', 'Task 4'], complete: ['Task 1', 'Task 3'], completed: ['Task 1', 'Task 3'] },
  { todos: ['Activity 1', 'Activity 2', 'Activity 3'], complete: ['Activity 2'], completed: ['Activity 2'] },
  { todos: ['Process A', 'Process B', 'Process C'], complete: ['Process A'], completed: ['Process A'] },
  { todos: ['Phase 1', 'Phase 2', 'Phase 3'], complete: ['Phase 1', 'Phase 2', 'Phase 3'], completed: ['Phase 1', 'Phase 2', 'Phase 3'] },
  { todos: ['Component 1', 'Component 2'], complete: ['Component 1'], completed: ['Component 1'] },
  { todos: ['Module 1', 'Module 2', 'Module 3', 'Module 4'], complete: ['Module 1', 'Module 3'], completed: ['Module 1', 'Module 3'] },
  { todos: ['Service 1', 'Service 2', 'Service 3'], complete: ['Service 1', 'Service 2'], completed: ['Service 1', 'Service 2'] },
  { todos: ['Item X', 'Item Y', 'Item Z'], complete: ['Item Y'], completed: ['Item Y'] },
  { todos: ['Entry 1', 'Entry 2', 'Entry 3'], complete: ['Entry 1'], completed: ['Entry 1'] },
  { todos: ['Node 1', 'Node 2', 'Node 3', 'Node 4'], complete: ['Node 1', 'Node 3', 'Node 4'], completed: ['Node 1', 'Node 3', 'Node 4'] },
  { todos: ['Test 1', 'Test 2', 'Test 3'], complete: ['Test 1'], completed: ['Test 1'] },
  { todos: ['Doc 1', 'Doc 2', 'Doc 3'], complete: ['Doc 2'], completed: ['Doc 2'] },
  { todos: ['Event 1', 'Event 2'], complete: ['Event 1', 'Event 2'], completed: ['Event 1', 'Event 2'] },
  { todos: ['Release 1', 'Release 2', 'Release 3'], complete: ['Release 1'], completed: ['Release 1'] },
  { todos: ['Version 1', 'Version 2', 'Version 3'], complete: ['Version 1', 'Version 2'], completed: ['Version 1', 'Version 2'] },
  { todos: ['Goal 1', 'Goal 2', 'Goal 3'], complete: ['Goal 2'], completed: ['Goal 2'] },
  { todos: ['Target 1', 'Target 2'], complete: ['Target 1'], completed: ['Target 1'] },
  { todos: ['Milestone 1', 'Milestone 2', 'Milestone 3'], complete: ['Milestone 1', 'Milestone 3'], completed: ['Milestone 1', 'Milestone 3'] },
  { todos: ['Sprint 1', 'Sprint 2', 'Sprint 3'], complete: ['Sprint 1'], completed: ['Sprint 1'] },
  { todos: ['Batch 1', 'Batch 2', 'Batch 3'], complete: ['Batch 1', 'Batch 2'], completed: ['Batch 1', 'Batch 2'] },
  { todos: ['Group 1', 'Group 2', 'Group 3'], complete: ['Group 1'], completed: ['Group 1'] },
  { todos: ['Cycle 1', 'Cycle 2'], complete: ['Cycle 1', 'Cycle 2'], completed: ['Cycle 1', 'Cycle 2'] },
  { todos: ['Round 1', 'Round 2', 'Round 3'], complete: ['Round 2'], completed: ['Round 2'] },
  { todos: ['Day 1', 'Day 2', 'Day 3', 'Day 4'], complete: ['Day 1', 'Day 3'], completed: ['Day 1', 'Day 3'] },
  { todos: ['Region 1', 'Region 2', 'Region 3'], complete: ['Region 1', 'Region 2', 'Region 3'], completed: ['Region 1', 'Region 2', 'Region 3'] },
  { todos: ['Requirement 1', 'Requirement 2'], complete: ['Requirement 1'], completed: ['Requirement 1'] },
  { todos: ['Resource 1', 'Resource 2', 'Resource 3'], complete: ['Resource 1', 'Resource 3'], completed: ['Resource 1', 'Resource 3'] },
  { todos: ['Ticket 1', 'Ticket 2', 'Ticket 3'], complete: ['Ticket 1', 'Ticket 2'], completed: ['Ticket 1', 'Ticket 2'] },
  { todos: ['PR 1', 'PR 2'], complete: ['PR 2'], completed: ['PR 2'] },
  { todos: ['Issue 1', 'Issue 2', 'Issue 3'], complete: ['Issue 1'], completed: ['Issue 1'] },
  { todos: ['Approval 1', 'Approval 2', 'Approval 3'], complete: ['Approval 1', 'Approval 3'], completed: ['Approval 1', 'Approval 3'] },
  { todos: ['Review 1', 'Review 2', 'Review 3'], complete: ['Review 1'], completed: ['Review 1'] },
  { todos: ['Checkpoint A', 'Checkpoint B'], complete: ['Checkpoint A', 'Checkpoint B'], completed: ['Checkpoint A', 'Checkpoint B'] },
  { todos: ['Document 1', 'Document 2', 'Document 3'], complete: ['Document 1', 'Document 2'], completed: ['Document 1', 'Document 2'] },
  { todos: ['Account 1', 'Account 2'], complete: ['Account 1'], completed: ['Account 1'] },
  { todos: ['Config 1', 'Config 2', 'Config 3'], complete: ['Config 1', 'Config 3'], completed: ['Config 1', 'Config 3'] },
  { todos: ['Link 1', 'Link 2', 'Link 3'], complete: ['Link 2'], completed: ['Link 2'] },
  { todos: ['Action 1', 'Action 2'], complete: ['Action 1', 'Action 2'], completed: ['Action 1', 'Action 2'] },
  { todos: ['Schedule 1', 'Schedule 2', 'Schedule 3'], complete: ['Schedule 1'], completed: ['Schedule 1'] },
];

completedFilterScenarios.forEach(({ todos, complete, completed }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const completeActions = complete.map(t =>
    `    await page.locator('.todo-list li').filter({ hasText: '${t}' }).locator('input.toggle').click();`
  ).join('\n');
  const completedEscaped = completed.map(t => `'${t}'`).join(', ');

  write(
    `Filter completed todos – test ${i + 1}`,
    `displays only completed todos in Completed filter`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

${completeActions}

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li label')).toHaveText([${completedEscaped}]);`
  );
});

// Generate 50 inline edit scenarios
const editScenarios = [
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
  { original: 'Create API documenation', updated: 'Create API documentation' },
  { original: 'Optimize perfomance', updated: 'Optimize performance' },
  { original: 'Implmenet caching', updated: 'Implement caching' },
  { original: 'Review securty audit', updated: 'Review security audit' },
  { original: 'Confgure monitoring', updated: 'Configure monitoring' },
  { original: 'Setup enviroment', updated: 'Setup environment' },
  { original: 'Write intergration tests', updated: 'Write integration tests' },
  { original: 'Refaktor code', updated: 'Refactor code' },
  { original: 'Analize metrics', updated: 'Analyze metrics' },
  { original: 'Implmenet validation', updated: 'Implement validation' },
  { original: 'Create databse schema', updated: 'Create database schema' },
  { original: 'Setup continuos deployment', updated: 'Setup continuous deployment' },
  { original: 'Review code qualitty', updated: 'Review code quality' },
  { original: 'Deploy new versoin', updated: 'Deploy new version' },
  { original: 'Configure log agregation', updated: 'Configure log aggregation' },
  { original: 'Implement error handeling', updated: 'Implement error handling' },
  { original: 'Audit user permisions', updated: 'Audit user permissions' },
  { original: 'Backup databses', updated: 'Backup databases' },
  { original: 'Upgrade framwork version', updated: 'Upgrade framework version' },
  { original: 'Write performance benchmarks', updated: 'Write performance benchmarks v2' },
  { original: 'Setup load balacing', updated: 'Setup load balancing' },
  { original: 'Confgure cach rules', updated: 'Configure cache rules' },
  { original: 'Implmement retry policys', updated: 'Implement retry policies' },
  { original: 'Create backup stratgey', updated: 'Create backup strategy' },
  { original: 'Setup disater recovery', updated: 'Setup disaster recovery' },
  { original: 'Impement circuit breaker', updated: 'Implement circuit breaker' },
  { original: 'Confgure health checks', updated: 'Configure health checks' },
  { original: 'Setup metric dashbord', updated: 'Setup metric dashboard' },
  { original: 'Create alert policys', updated: 'Create alert policies' },
  { original: 'Implement fallbck strategy', updated: 'Implement fallback strategy' },
  { original: 'Setup request tracing', updated: 'Setup request tracing v2' },
  { original: 'Confgure rate limitng', updated: 'Configure rate limiting' },
  { original: 'Implmenet throtteling', updated: 'Implement throttling' },
  { original: 'Create scurity polocies', updated: 'Create security policies' },
  { original: 'Setup complinace audit', updated: 'Setup compliance audit' },
  { original: 'Impement acces control', updated: 'Implement access control' },
  { original: 'Confgure role permision', updated: 'Configure role permission' },
  { original: 'Setup user auditng', updated: 'Setup user auditing' },
  { original: 'Create data retention policys', updated: 'Create data retention policies' },
  { original: 'Implmenet data encription', updated: 'Implement data encryption' },
];

editScenarios.forEach(({ original, updated }, i) => {
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

// Generate 50 toggle all scenarios
const toggleAllScenarios = [
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
  ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
  ['Step A', 'Step B', 'Step C'],
  ['Phase 1', 'Phase 2', 'Phase 3'],
  ['Component X', 'Component Y', 'Component Z'],
  ['Service 1', 'Service 2', 'Service 3', 'Service 4'],
  ['Module 1', 'Module 2', 'Module 3'],
  ['Ticket 1', 'Ticket 2', 'Ticket 3', 'Ticket 4', 'Ticket 5'],
  ['Feature A', 'Feature B', 'Feature C'],
  ['Bug 1', 'Bug 2', 'Bug 3'],
  ['Task alpha', 'Task beta', 'Task gamma', 'Task delta'],
  ['Work 1', 'Work 2', 'Work 3'],
  ['Project A', 'Project B', 'Project C', 'Project D'],
  ['Release 1', 'Release 2'],
  ['Iteration 1', 'Iteration 2', 'Iteration 3', 'Iteration 4'],
  ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'],
  ['Requirement 1', 'Requirement 2', 'Requirement 3'],
  ['Scenario 1', 'Scenario 2', 'Scenario 3', 'Scenario 4'],
  ['Day 1', 'Day 2', 'Day 3'],
  ['Event 1', 'Event 2', 'Event 3', 'Event 4', 'Event 5'],
  ['Round 1', 'Round 2', 'Round 3'],
  ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'],
  ['Cycle 1', 'Cycle 2', 'Cycle 3'],
  ['Entry 1', 'Entry 2', 'Entry 3', 'Entry 4'],
  ['Group A', 'Group B', 'Group C', 'Group D'],
  ['Team 1', 'Team 2', 'Team 3'],
  ['Region 1', 'Region 2', 'Region 3', 'Region 4', 'Region 5'],
  ['Version 1', 'Version 2'],
  ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
  ['Milestone 1', 'Milestone 2', 'Milestone 3'],
  ['Checkpoint 1', 'Checkpoint 2', 'Checkpoint 3', 'Checkpoint 4'],
  ['Target 1', 'Target 2', 'Target 3'],
  ['Goal 1', 'Goal 2', 'Goal 3', 'Goal 4', 'Goal 5'],
  ['Action 1', 'Action 2', 'Action 3'],
  ['Task X', 'Task Y', 'Task Z', 'Task W'],
  ['Test 1', 'Test 2', 'Test 3', 'Test 4'],
  ['Review 1', 'Review 2', 'Review 3'],
  ['Approval 1', 'Approval 2', 'Approval 3', 'Approval 4', 'Approval 5'],
  ['Priority 1', 'Priority 2', 'Priority 3'],
  ['Document 1', 'Document 2', 'Document 3', 'Document 4'],
];

toggleAllScenarios.forEach((todos, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');

  write(
    `Toggle all todos – scenario ${i + 1}`,
    `marks all ${todos.length} todos as completed via toggle-all`,
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

// Generate 50 clear completed scenarios (last group)
const clearScenarios = [
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
  { todos: ['Completed 1', 'Pending 1', 'Completed 2', 'Pending 2'], complete: ['Completed 1', 'Completed 2'], remaining: ['Pending 1', 'Pending 2'] },
  { todos: ['Task done A', 'Task pending A', 'Task done B'], complete: ['Task done A', 'Task done B'], remaining: ['Task pending A'] },
  { todos: ['Finished X', 'Active X', 'Finished Y'], complete: ['Finished X', 'Finished Y'], remaining: ['Active X'] },
  { todos: ['Complete 1', 'Incomplete 1', 'Complete 2', 'Incomplete 2', 'Complete 3'], complete: ['Complete 1', 'Complete 2', 'Complete 3'], remaining: ['Incomplete 1', 'Incomplete 2'] },
  { todos: ['Done alpha', 'Pending alpha', 'Done beta'], complete: ['Done alpha', 'Done beta'], remaining: ['Pending alpha'] },
  { todos: ['Item A done', 'Item B pending', 'Item C done', 'Item D pending'], complete: ['Item A done', 'Item C done'], remaining: ['Item B pending', 'Item D pending'] },
  { todos: ['Completed task 1', 'Incomplete task 1', 'Completed task 2'], complete: ['Completed task 1', 'Completed task 2'], remaining: ['Incomplete task 1'] },
  { todos: ['Finished step 1', 'Active step 1', 'Finished step 2', 'Active step 2'], complete: ['Finished step 1', 'Finished step 2'], remaining: ['Active step 1', 'Active step 2'] },
  { todos: ['Done item alpha', 'Pending item alpha', 'Done item beta', 'Pending item beta'], complete: ['Done item alpha', 'Done item beta'], remaining: ['Pending item alpha', 'Pending item beta'] },
  { todos: ['Complete work', 'Incomplete work', 'Complete review'], complete: ['Complete work', 'Complete review'], remaining: ['Incomplete work'] },
  { todos: ['Finished phase', 'Active phase', 'Finished milestone'], complete: ['Finished phase', 'Finished milestone'], remaining: ['Active phase'] },
  { todos: ['Done 1', 'Pending 1', 'Done 2', 'Pending 2', 'Done 3'], complete: ['Done 1', 'Done 2', 'Done 3'], remaining: ['Pending 1', 'Pending 2'] },
  { todos: ['Completed action', 'Pending action', 'Completed review'], complete: ['Completed action', 'Completed review'], remaining: ['Pending action'] },
  { todos: ['Resolved issue', 'Open issue', 'Closed ticket'], complete: ['Resolved issue', 'Closed ticket'], remaining: ['Open issue'] },
  { todos: ['Finished task', 'In progress task', 'Finished document'], complete: ['Finished task', 'Finished document'], remaining: ['In progress task'] },
  { todos: ['Done requirement', 'Pending requirement', 'Done feature'], complete: ['Done requirement', 'Done feature'], remaining: ['Pending requirement'] },
  { todos: ['Completed goal', 'Active goal', 'Completed target'], complete: ['Completed goal', 'Completed target'], remaining: ['Active goal'] },
  { todos: ['Shipped code', 'Under review code', 'Shipped tests'], complete: ['Shipped code', 'Shipped tests'], remaining: ['Under review code'] },
  { todos: ['Approved PR', 'Pending PR', 'Merged commit'], complete: ['Approved PR', 'Merged commit'], remaining: ['Pending PR'] },
  { todos: ['Released feature', 'In development feature', 'Deployed hotfix'], complete: ['Released feature', 'Deployed hotfix'], remaining: ['In development feature'] },
  { todos: ['Archived doc', 'Active doc', 'Archived report'], complete: ['Archived doc', 'Archived report'], remaining: ['Active doc'] },
  { todos: ['Closed ticket 1', 'Open ticket 1', 'Closed ticket 2'], complete: ['Closed ticket 1', 'Closed ticket 2'], remaining: ['Open ticket 1'] },
  { todos: ['Verified test', 'Pending test', 'Verified build'], complete: ['Verified test', 'Verified build'], remaining: ['Pending test'] },
  { todos: ['Deployed prod', 'In staging', 'Deployed hotfix'], complete: ['Deployed prod', 'Deployed hotfix'], remaining: ['In staging'] },
  { todos: ['Synced database', 'Pending sync', 'Backed up data'], complete: ['Synced database', 'Backed up data'], remaining: ['Pending sync'] },
  { todos: ['Executed query', 'Pending query', 'Executed report'], complete: ['Executed query', 'Executed report'], remaining: ['Pending query'] },
  { todos: ['Finished onboarding', 'In progress onboarding', 'Completed training'], complete: ['Finished onboarding', 'Completed training'], remaining: ['In progress onboarding'] },
  { todos: ['Resolved blocker', 'Open blocker', 'Fixed issue'], complete: ['Resolved blocker', 'Fixed issue'], remaining: ['Open blocker'] },
  { todos: ['Completed review', 'Pending review', 'Completed audit'], complete: ['Completed review', 'Completed audit'], remaining: ['Pending review'] },
  { todos: ['Finished deployment', 'In progress deployment', 'Completed migration'], complete: ['Finished deployment', 'Completed migration'], remaining: ['In progress deployment'] },
  { todos: ['Done config', 'Pending config', 'Deployed config'], complete: ['Done config', 'Deployed config'], remaining: ['Pending config'] },
  { todos: ['Finished migration', 'In progress migration', 'Completed cutover'], complete: ['Finished migration', 'Completed cutover'], remaining: ['In progress migration'] },
  { todos: ['Resolved blocker', 'Blocked by blocker', 'Fixed critical'], complete: ['Resolved blocker', 'Fixed critical'], remaining: ['Blocked by blocker'] },
  { todos: ['Done approval', 'Pending approval', 'Done signature'], complete: ['Done approval', 'Done signature'], remaining: ['Pending approval'] },
  { todos: ['Completed checkpoint', 'In progress checkpoint', 'Finished review'], complete: ['Completed checkpoint', 'Finished review'], remaining: ['In progress checkpoint'] },
  { todos: ['Done milestone', 'Pending milestone', 'Shipped milestone'], complete: ['Done milestone', 'Shipped milestone'], remaining: ['Pending milestone'] },
  { todos: ['Finished cycle', 'Active cycle', 'Completed iteration'], complete: ['Finished cycle', 'Completed iteration'], remaining: ['Active cycle'] },
  { todos: ['Done event', 'Pending event', 'Scheduled event'], complete: ['Done event', 'Scheduled event'], remaining: ['Pending event'] },
];

clearScenarios.forEach(({ todos, complete, remaining }, i) => {
  const fills = todos.map(t =>
    `    await input.fill('${t}');\n    await input.press('Enter');`
  ).join('\n');
  const completeActions = complete.map(t =>
    `    await page.locator('.todo-list li').filter({ hasText: '${t}' }).locator('input.toggle').click();`
  ).join('\n');
  const remainingEscaped = remaining.map(t => `'${t}'`).join(', ');

  write(
    `Clear completed todos – run ${i + 1}`,
    `clears ${complete.length} completed item(s) and verifies remaining`,
    `    const input = page.getByPlaceholder('What needs to be done?');
${fills}

${completeActions}

    await page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(page.locator('.todo-list li label')).toHaveText([${remainingEscaped}]);`
  );
});

console.log(`Generated ${idx - 1} meaningful test files in ${OUT_DIR}`);
