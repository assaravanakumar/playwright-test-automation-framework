const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

const VALID_USER = { username: 'standard_user', password: 'secret_sauce' };

/**
 * Extends the base test with page-object fixtures and an `authenticatedPage`
 * fixture that performs login once per test as a reusable setup step.
 */
const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Fixture-based hook: logs in before the test body runs, cleans up after.
  authenticatedPage: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await inventoryPage.isLoaded();

    await use(page);

    // Teardown: clear storage so the next test starts from a clean slate.
    await page.context().clearCookies();
  },
});

const expect = base.expect;

module.exports = { test, expect, VALID_USER };
