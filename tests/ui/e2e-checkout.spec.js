const { test, expect } = require('../../fixtures/pageFixtures');
const checkoutCustomers = require('../../data/checkout.json');
const products = require('../../data/products.json');

test.describe('Real-world scenario: end-to-end purchase', () => {
  for (const customer of checkoutCustomers) {
    test(`${customer.firstName} ${customer.lastName} completes a purchase`, async ({
      authenticatedPage,
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      await inventoryPage.addProductToCart(products[0]);
      await inventoryPage.addProductToCart(products[1]);
      expect(await inventoryPage.getCartCount()).toBe(2);

      await inventoryPage.goToCart();
      const cartItems = await cartPage.getItemNames();
      expect(cartItems).toEqual(expect.arrayContaining([products[0], products[1]]));

      await cartPage.checkout();
      await checkoutPage.fillCustomerInfo(customer);
      await checkoutPage.finishOrder();

      const confirmation = await checkoutPage.getConfirmationMessage();
      expect(confirmation).toMatch(/Thank you for your order/i);
    });
  }

  test('checkout blocks submission when required customer info is missing', async ({
    authenticatedPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart(products[0]);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    await checkoutPage.continueButton.click(); // submit with all fields empty
    const errorText = await checkoutPage.errorMessage.textContent();
    expect(errorText).toContain('First Name is required');
  });
});
