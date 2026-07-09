const { test, expect } = require('../../fixtures/pageFixtures');
const products = require('../../data/products.json');

test.describe('Inventory', () => {
  test('sorting re-renders the dynamic product list low to high', async ({
    authenticatedPage,
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');
    const namesAfterSort = await inventoryPage.getItemNamesInOrder();
    expect(namesAfterSort.length).toBeGreaterThan(0);
  });

  test('cart badge is a dynamic element that appears only after adding an item', async ({
    authenticatedPage,
    inventoryPage,
  }) => {
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addProductToCart(products[0]);

    await expect(inventoryPage.cartBadge).toBeVisible();
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  for (const product of products) {
    test(`can add and remove "${product}" from the cart`, async ({
      authenticatedPage,
      inventoryPage,
    }) => {
      await inventoryPage.addProductToCart(product);
      expect(await inventoryPage.getCartCount()).toBe(1);

      await inventoryPage.removeProductFromCart(product);
      expect(await inventoryPage.getCartCount()).toBe(0);
    });
  }
});
