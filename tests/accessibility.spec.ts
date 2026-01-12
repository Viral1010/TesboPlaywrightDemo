import fs from 'fs';
import type { SerializedAXNode } from '@playwright/test';
import { expect, test } from './fixtures';

const TODO_URL = '/todomvc';

const rolesRequiringNames = new Set([
  'button',
  'link',
  'textbox',
  'checkbox',
  'radio',
  'combobox',
  'switch',
  'slider',
  'menuitem',
  'tab',
  'tabpanel',
  'img'
]);

test('captures accessibility snapshot and highlights missing names', async ({ page, actionLogger }, testInfo) => {
  await actionLogger.record(page, {
    description: 'Load TodoMVC for accessibility audit',
    locatorDescription: `page.goto('${TODO_URL}') request`,
    locator: page.locator('body'),
    action: async () => {
      await page.goto(TODO_URL);
      await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
    },
    notes: 'Ensure the page is fully rendered before scanning'
  });

  let snapshot: SerializedAXNode | null = null;
  const snapshotPath = testInfo.outputPath('a11y-tree.json');

  await actionLogger.record(page, {
    description: 'Capture full accessibility tree',
    locatorDescription: 'document body (context for snapshot)',
    locator: page.locator('body'),
    action: async () => {
      snapshot = await page.accessibility.snapshot({ interestingOnly: false });
      await fs.promises.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2));
      await testInfo.attach('accessibility-tree', {
        path: snapshotPath,
        contentType: 'application/json'
      });
    },
    notes: 'Tree is stored as JSON in the test artifacts',
    captureFullPage: true
  });

  const issues = snapshot ? collectMissingNames(snapshot) : [];
  const issuesPath = testInfo.outputPath('a11y-issues.json');

  await fs.promises.writeFile(
    issuesPath,
    JSON.stringify({ count: issues.length, issues }, null, 2)
  );

  await testInfo.attach('accessibility-issues', {
    path: issuesPath,
    contentType: 'application/json'
  });

  expect.soft(issues, 'Interactive elements should have accessible names').toEqual([]);
});

function collectMissingNames(
  node: SerializedAXNode,
  path: string[] = []
): Array<{ role?: string; name?: string; path: string; description: string }> {
  const current = [...path, node.name ? `${node.role} "${node.name}"` : node.role ?? 'unknown'];
  const issues =
    node.role && requiresName(node.role) && (!node.name || node.name.trim() === '')
      ? [
          {
            role: node.role,
            name: node.name ?? '',
            path: current.join(' > '),
            description: 'Missing accessible name'
          }
        ]
      : [];

  for (const child of node.children ?? []) {
    issues.push(...collectMissingNames(child, current));
  }

  return issues;
}

function requiresName(role: string): boolean {
  return rolesRequiringNames.has(role);
}

