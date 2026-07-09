# Playwright Test Automation Framework

End-to-end and API test automation built with Playwright + JavaScript.

- **UI target:** https://www.saucedemo.com (public demo e-commerce app)
- **API target:** https://jsonplaceholder.typicode.com (public no-auth REST API)

## Coverage

| Capability | Where |
|---|---|
| Page Object Model | [`pages/`](pages) — `BasePage`, `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage` |
| API testing | [`tests/api/posts.spec.js`](tests/api/posts.spec.js) — full CRUD lifecycle |
| Hooks & fixtures | [`fixtures/pageFixtures.js`](fixtures/pageFixtures.js) (`authenticatedPage` login fixture), [`fixtures/apiFixtures.js`](fixtures/apiFixtures.js) (`apiContext`), `test.beforeEach` in specs |
| Locator strategies | `getByTestId`, `getByRole`, CSS, text/`hasText`, XPath — see `pages/InventoryPage.js` |
| Dynamic elements | `pages/InventoryPage.js` (`waitForFunction` after sort, cart badge that only renders conditionally), `pages/BasePage.js` (`waitUntil` polling helper) |
| Screenshots & video on failure | `playwright.config.js` → `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `trace: 'on-first-retry'` |
| Cross-browser testing | `playwright.config.js` projects: `chromium`, `firefox`, `webkit` |
| CI/CD integration | [`.gitlab-ci.yml`](.gitlab-ci.yml) — parallel per-browser jobs, artifacts, JUnit report |
| Data-driven testing | `data/*.json` looped over in `tests/ui/login.spec.js`, `tests/ui/e2e-checkout.spec.js`, `tests/api/posts.spec.js` |
| Parallel execution | `fullyParallel: true` + CI `workers` in `playwright.config.js`, parallel GitLab jobs |
| Real-world scenario | [`tests/ui/e2e-checkout.spec.js`](tests/ui/e2e-checkout.spec.js) — full login → add to cart → checkout → confirmation flow |

## Project structure

```
pages/          Page Object classes (one per page/component)
fixtures/       Custom Playwright fixtures (test.extend)
data/           JSON fixtures for data-driven tests
tests/ui/       Browser-driven specs (saucedemo.com)
tests/api/      API specs (jsonplaceholder.typicode.com)
playwright.config.js
.gitlab-ci.yml
```

## Getting started

```bash
npm install
npx playwright install --with-deps
npm test                 # everything: 3 browsers + API project
npm run test:ui          # UI specs only (all browsers)
npm run test:api         # API specs only
npm run test:chromium    # single browser
npm run test:headed      # watch it run
npm run report           # open the last HTML report
```

Override targets without touching code:

```bash
UI_BASE_URL=https://staging.example.com API_BASE_URL=https://api.example.com npm test
```

## Notes

- `authenticatedPage` fixture (`fixtures/pageFixtures.js`) logs in once per test as reusable setup and clears cookies on teardown — specs that need a logged-in session just request it as an argument.
- Retries are enabled only in CI (`retries: 2`) to absorb flake without masking local failures.
- The GitLab pipeline runs `chromium`, `firefox`, `webkit`, and `api` as independent parallel jobs and always uploads `playwright-report/` and `test-results/` (including screenshots/videos on failure), even when a job fails.
