class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** Poll a dynamic element until it satisfies a predicate (e.g. text changes after an async update). */
  async waitUntil(locator, predicate, { timeout = 10000, interval = 250 } = {}) {
    const start = Date.now();
    let lastValue;
    while (Date.now() - start < timeout) {
      lastValue = await locator.textContent();
      if (predicate(lastValue)) return lastValue;
      await this.page.waitForTimeout(interval);
    }
    throw new Error(`waitUntil timed out after ${timeout}ms, last value: "${lastValue}"`);
  }

  /** Wait for network to settle after actions that trigger async requests (dynamic content loads). */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/manual/${name}.png`, fullPage: true });
  }
}

module.exports = { BasePage };
