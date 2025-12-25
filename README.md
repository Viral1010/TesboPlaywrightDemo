## Demo Playwright TodoMVC Suite

This project automates the official TodoMVC demo hosted at `https://demo.playwright.dev/todomvc`.  
It ships with ten end-to-end scenarios that document every user interaction with screenshots and JSON logs so you can trace how each locator was validated and exercised.

### Prerequisites
- Node.js 18+ and npm
- Browsers installed via `npx playwright install` (already run once for this repo)

### Installation
```bash
npm install
```

### Test Scripts
- `npm test` &mdash; run the full suite headless in parallel.
- `npm run test:headed` &mdash; open real browsers to watch each step.
- `npm run test:debug` &mdash; launch with Playwright Inspector for step-by-step debugging.
- `npm run test:report` &mdash; open the most recent HTML report generated in `artifacts/html-report`.
- `npm run test:reporter-samples` &mdash; intentionally execute the failure-only suite (see below).

### Evidence & Logging
Each test uses the custom `ActionLogger` fixture (`src/utils/actionLogger.ts`) to:
- capture the DOM locator being used plus why it is safe;
- validate that the locator is present before performing the action;
- save a full-page screenshot for the step under `artifacts/screenshots/<test-name>`;
- persist a structured JSON log per test in `artifacts/logs` and attach it to the Playwright report.

These logs satisfy the requirement of proving which locators were analyzed, when they were validated, and the exact action that followed.

### Test Coverage
All scenarios live in `tests/todomvc.spec.ts`:
1. Add a single todo
2. Add multiple todos and validate the footer counter
3. Mark an item as completed
4. Toggle every todo via the master checkbox
5. Edit an existing todo inline
6. Delete a todo with the destroy button
7. Filter to active todos
8. Filter to completed todos
9. Clear completed todos via the footer button
10. Persist todos across a page reload

Run `npx playwright test --project=chromium` (or omit the flag to run on all configured browsers) to reproduce the latest passing run. Artifacts are stored under `artifacts/test-results` along with the HTML report, traces, screenshots, and videos.

### Reporter Failure Samples
To exercise custom reporters or JSON parsers with diverse failure signatures, run:
```bash
npm run test:reporter-samples -- --reporter=json,line
```
This sets `REPORTER_SAMPLES=1` and executes `tests/reporter-samples.spec.ts`, which contains four scenarios that fail for different reasons (assertion mismatch, missing locator timeout, hidden-element click, and manual runtime error). Use the generated `test-results.json` or custom reporter output to verify your visualization logic without breaking the main passing suite.

