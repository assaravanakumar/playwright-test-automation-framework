const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    // Step one: customer info
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    // Step two: overview
    this.finishButton = page.getByTestId('finish');
    this.itemTotal = page.getByTestId('subtotal-label');

    // Step three: confirmation
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getConfirmationMessage() {
    await this.completeHeader.waitFor({ state: 'visible' });
    return this.completeHeader.textContent();
  }
}

module.exports = { CheckoutPage };
