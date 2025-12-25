import { test, Locator, Page, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type StepEntry = {
  description: string;
  locator: string;
  screenshot: string;
  timestamp: string;
  notes?: string;
};

export class ActionLogger {
  private readonly entries: StepEntry[] = [];
  private readonly screenshotDir: string;
  private readonly logFile: string;
  private readonly safeTitle: string;

  constructor(private readonly testInfo: TestInfo) {
    const rawTitlePath =
      typeof this.testInfo.titlePath === 'function'
        ? this.testInfo.titlePath()
        : this.testInfo.titlePath;
    this.safeTitle = this.slug(rawTitlePath.join('__'));
    this.screenshotDir = path.join(
      process.cwd(),
      'artifacts',
      'screenshots',
      this.safeTitle
    );
    this.logFile = path.join(
      process.cwd(),
      'artifacts',
      'logs',
      `${this.safeTitle}.json`
    );
    fs.mkdirSync(this.screenshotDir, { recursive: true });
    fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
  }

  async record(
    page: Page,
    options: {
      description: string;
      locatorDescription: string;
      locator?: Locator;
      action: () => Promise<void>;
      notes?: string;
      captureFullPage?: boolean;
      waitForVisible?: boolean;
    }
  ): Promise<void> {
    const {
      description,
      locatorDescription,
      locator,
      action,
      notes,
      captureFullPage,
      waitForVisible = true
    } =
      options;

    await test.step(description, async () => {
      if (locator && waitForVisible) {
        await locator.waitFor({ state: 'visible' });
      }

      await action();

      const screenshotName = `${Date.now()}-${this.slug(description)}.png`;
      const screenshotPath = path.join(this.screenshotDir, screenshotName);
      await page.screenshot({
        path: screenshotPath,
        fullPage: captureFullPage ?? true
      });

      this.entries.push({
        description,
        locator: locatorDescription,
        screenshot: path.relative(process.cwd(), screenshotPath),
        timestamp: new Date().toISOString(),
        notes
      });
    });
  }

  async flush(): Promise<void> {
    const payload = {
      testTitle: this.testInfo.title,
      project: this.testInfo.project.name,
      steps: this.entries
    };

    await fs.promises.writeFile(this.logFile, JSON.stringify(payload, null, 2));
    await this.testInfo.attach('action-log', {
      path: this.logFile,
      contentType: 'application/json'
    });
  }

  private slug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

