import { test as base } from '@playwright/test';
import { ActionLogger } from '../src/utils/actionLogger';

type Fixtures = {
  actionLogger: ActionLogger;
};

export const test = base.extend<Fixtures>({
  actionLogger: async ({}, use, testInfo) => {
    const logger = new ActionLogger(testInfo);
    await use(logger);
    await logger.flush();
  }
});

export const expect = test.expect;

