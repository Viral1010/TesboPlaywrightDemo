import type { Page } from '@playwright/test';
import type { ActionLogger } from '../src/utils/actionLogger';
import { expect, test } from './fixtures';

const TODO_URL = '/todomvc';
const TODO_PLACEHOLDER = 'What needs to be done?';

const selectors = {
  input: (page: Page) => page.getByPlaceholder(TODO_PLACEHOLDER),
  todoItems: (page: Page) => page.locator('.todo-list li'),
  toggleAll: (page: Page) => page.locator('.toggle-all'),
  clearCompletedButton: (page: Page) => page.getByRole('button', { name: 'Clear completed' }),
  filter: (page: Page, label: 'All' | 'Active' | 'Completed') =>
    page.getByRole('link', { name: label })
};

test.beforeEach(async ({ page, actionLogger }) => {
  await actionLogger.record(page, {
    description: 'Load the TodoMVC demo application',
    locatorDescription: `page.goto('${TODO_URL}') request`,
    action: async () => {
      await page.goto(TODO_URL);
      await expect(selectors.input(page)).toBeVisible();
    },
    notes: 'Ensures every test begins from a clean state'
  });
});

test('adds a single todo item', async ({ page, actionLogger }) => {
  await addTodo(page, actionLogger, 'Learn Playwright');
  await assertTodoTexts(page, actionLogger, ['Learn Playwright']);
  await assertItemsLeft(page, actionLogger, 1);
});

test('adds multiple todos and updates the counter', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['Learn PW', 'Write docs', 'Share demo']);
  await assertTodoTexts(page, actionLogger, ['Learn PW', 'Write docs', 'Share demo']);
  await assertItemsLeft(page, actionLogger, 3);
});

test('marks a todo as completed', async ({ page, actionLogger }) => {
  await addTodo(page, actionLogger, 'Complete assignment');
  await toggleTodo(page, actionLogger, 'Complete assignment');
  await actionLogger.record(page, {
    description: 'Verify todo is completed',
    locatorDescription: 'li todo item with class .completed',
    locator: selectors.todoItems(page).filter({ hasText: 'Complete assignment' }).first(),
    action: async () => {
      await expect(
        selectors.todoItems(page).filter({ hasText: 'Complete assignment' })
      ).toHaveClass(/completed/);
    },
    notes: 'Completed items should gain the completed class for styling'
  });
});

test('toggles all todos at once', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['One', 'Two', 'Three']);
  await actionLogger.record(page, {
    description: 'Toggle all todos via master checkbox',
    locatorDescription: 'input.toggle-all',
    locator: selectors.toggleAll(page),
    action: async () => {
      await selectors.toggleAll(page).check();
    },
    notes: 'Ensures the toggle-all control marks every todo completed'
  });
  await actionLogger.record(page, {
    description: 'Confirm every todo is checked',
    locatorDescription: '.todo-list li input.toggle',
    locator: selectors.todoItems(page).locator('input.toggle'),
    action: async () => {
      const toggles = selectors.todoItems(page).locator('input.toggle');
      const count = await toggles.count();
      for (let index = 0; index < count; index += 1) {
        await expect(toggles.nth(index)).toBeChecked();
      }
    },
    notes: 'All individual toggles should reflect the bulk action',
    waitForVisible: false
  });
});

test('edits an existing todo inline', async ({ page, actionLogger }) => {
  await addTodo(page, actionLogger, 'Original text');
  const todo = selectors.todoItems(page).first();
  const label = todo.locator('label');
  await actionLogger.record(page, {
    description: 'Enter edit mode by double clicking the label',
    locatorDescription: 'li:first label text node',
    locator: label,
    action: async () => {
      await label.dblclick();
    },
    notes: 'Todo items switch to editing mode on double click'
  });
  const editor = todo.locator('.edit');
  await actionLogger.record(page, {
    description: 'Update todo text inside inline editor',
    locatorDescription: '.todo-list li.editing input.edit',
    locator: editor,
    action: async () => {
      await editor.fill('Updated text');
      await editor.press('Enter');
    },
    notes: 'Saving edit should update label text'
  });
  await assertTodoTexts(page, actionLogger, ['Updated text']);
});

test('deletes a todo using the destroy button', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['Keep me', 'Remove me']);
  await deleteTodo(page, actionLogger, 'Remove me');
  await assertTodoTexts(page, actionLogger, ['Keep me']);
});

test('filters to show only active todos', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['Active one', 'Completed item']);
  await toggleTodo(page, actionLogger, 'Completed item');
  await applyFilter(page, actionLogger, 'Active');
  await assertTodoTexts(page, actionLogger, ['Active one']);
});

test('filters to show only completed todos', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['Todo A', 'Todo B']);
  await toggleTodo(page, actionLogger, 'Todo B');
  await applyFilter(page, actionLogger, 'Completed');
  await assertTodoTexts(page, actionLogger, ['Todo B']);
});

test('clears all completed todos via the footer button', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['Done task', 'Active task']);
  await toggleTodo(page, actionLogger, 'Done task');
  await actionLogger.record(page, {
    description: 'Click Clear completed',
    locatorDescription: 'button:has-text("Clear completed")',
    locator: selectors.clearCompletedButton(page),
    action: async () => {
      await selectors.clearCompletedButton(page).click();
    },
    notes: 'Clear completed removes done tasks but keeps active ones'
  });
  await assertTodoTexts(page, actionLogger, ['Active task']);
});

test('persists todos after a page reload', async ({ page, actionLogger }) => {
  await addTodos(page, actionLogger, ['Remember me']);
  await actionLogger.record(page, {
    description: 'Reload the page to verify persistence',
    locatorDescription: 'page.reload()',
    action: async () => {
      await page.reload();
    },
    notes: 'The SPA persists todos in localStorage so they survive reloads'
  });
  await assertTodoTexts(page, actionLogger, ['Remember me']);
});

async function addTodos(page: Page, actionLogger: ActionLogger, todos: string[]): Promise<void> {
  for (const todo of todos) {
    await addTodo(page, actionLogger, todo);
  }
}

async function addTodo(page: Page, actionLogger: ActionLogger, text: string): Promise<void> {
  const input = selectors.input(page);
  await actionLogger.record(page, {
    description: `Add todo "${text}"`,
    locatorDescription: `input.new-todo[placeholder="${TODO_PLACEHOLDER}"]`,
    locator: input,
    action: async () => {
      await input.fill(text);
      await input.press('Enter');
    },
    notes: 'Pressing Enter should append a new list item'
  });
}

async function toggleTodo(page: Page, actionLogger: ActionLogger, text: string): Promise<void> {
  const todoItem = selectors.todoItems(page).filter({ hasText: text }).first();
  const toggle = todoItem.locator('input.toggle');
  await actionLogger.record(page, {
    description: `Toggle completion for "${text}"`,
    locatorDescription: 'input.toggle within matching li',
    locator: toggle,
    action: async () => {
      await toggle.click();
    },
    notes: 'The checkbox marks the todo completed or active'
  });
}

async function deleteTodo(page: Page, actionLogger: ActionLogger, text: string): Promise<void> {
  const todoItem = selectors.todoItems(page).filter({ hasText: text }).first();
  const destroyButton = todoItem.locator('button.destroy');
  await actionLogger.record(page, {
    description: `Delete todo "${text}"`,
    locatorDescription: 'button.destroy inside target li',
    locator: destroyButton,
    action: async () => {
      await todoItem.hover();
      await destroyButton.click();
    },
    notes: 'Destroy button appears on hover and removes the todo',
    waitForVisible: false
  });
}

async function applyFilter(
  page: Page,
  actionLogger: ActionLogger,
  filter: 'All' | 'Active' | 'Completed'
): Promise<void> {
  const link = selectors.filter(page, filter);
  await actionLogger.record(page, {
    description: `Switch to "${filter}" filter`,
    locatorDescription: `footer nav link with text ${filter}`,
    locator: link,
    action: async () => {
      await link.click();
    },
    notes: 'Filter links update the hash route to refine visible todos'
  });
}

async function assertTodoTexts(
  page: Page,
  actionLogger: ActionLogger,
  expected: string[]
): Promise<void> {
  const labels = selectors.todoItems(page).locator('label');
  await actionLogger.record(page, {
    description: 'Validate rendered todo text order',
    locatorDescription: '.todo-list li label collection',
    locator: labels,
    action: async () => {
      await expect(labels).toHaveText(expected);
    },
    notes: 'Ensures the UI reflects the expected list of todos',
    waitForVisible: false
  });
}

async function assertItemsLeft(
  page: Page,
  actionLogger: ActionLogger,
  expected: number
): Promise<void> {
  const counter = page.locator('.todo-count');
  await actionLogger.record(page, {
    description: `Check footer counter shows ${expected} items left`,
    locatorDescription: '.todo-count strong',
    locator: counter,
    action: async () => {
      await expect(counter).toContainText(`${expected} item`);
    },
    notes: 'The counter should match the number of active todos'
  });
}

