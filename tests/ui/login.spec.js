const { test, expect } = require('../../fixtures/pageFixtures');
const users = require('../../data/users.json');

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  for (const user of users.valid) {
    test(`accepts valid user: ${user.username}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.login(user.username, user.password);
      await inventoryPage.isLoaded();
      await expect(inventoryPage.pageTitle).toBeVisible();
    });
  }

  for (const { case: caseName, username, password, expectedError } of users.invalid) {
    test(`rejects invalid login: ${caseName}`, async ({ loginPage }) => {
      await loginPage.login(username, password);
      const errorText = await loginPage.getErrorText();
      expect(errorText).toContain(expectedError);
    });
  }
});
