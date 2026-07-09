const base = require('@playwright/test');

/**
 * Extends the base test with a preconfigured API request context fixture,
 * so specs don't repeat base URL / header setup.
 */
const test = base.test.extend({
  apiContext: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    await use(context);

    await context.dispose();
  },
});

const expect = base.expect;

module.exports = { test, expect };
