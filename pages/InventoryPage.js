const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    // Locator strategy: text content (the "Products" title is a styled <span>, not an ARIA heading)
    this.pageTitle = page.getByText('Products', { exact: true });
    // Locator strategy: test-id
    this.sortDropdown = page.getByTestId('product-sort-container');
    // Locator strategy: CSS class
    this.inventoryItems = page.locator('.inventory_item');
    // Locator strategy: text content
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  async isLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  /** Handles a dynamic element: the cart badge only renders once count > 0. */
  async getCartCount() {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async addProductToCart(productName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    // Locator strategy: XPath, scoped to the matched item, to reach the sibling button
    const addButton = item.locator('xpath=.//button[contains(@data-test, "add-to-cart")]');
    await addButton.click();
  }

  async removeProductFromCart(productName) {
    const item = this.inventoryItems.filter({ hasText: productName });
    const removeButton = item.getByRole('button', { name: 'Remove' });
    await removeButton.click();
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
    // Dynamic re-render: wait for the first item's price/name to reflect the new sort order.
    await this.page.waitForFunction(
      (expected) => document.querySelector('.product_sort_container')?.value === expected,
      optionValue
    );
  }

  async getItemNamesInOrder() {
    return this.inventoryItems.locator('.inventory_item_name').allTextContents();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}

module.exports = { InventoryPage };
