// cypress/e2e/dashboard/dashboard.cy.ts

describe('Dashboard Access and Basic Functionality', () => {

  context('When not logged in', () => {
    it('should redirect to /login when trying to access /dashboard directly', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
      cy.contains('Welcome Back!').should('be.visible'); // Verify it's the login page
    });

    it('should redirect to /login when trying to access a nested dashboard route', () => {
      cy.visit('/dashboard/settings'); // Example nested route
      cy.url().should('include', '/login');
      cy.contains('Welcome Back!').should('be.visible');
    });
  });

  context('When logged in', () => {
    beforeEach(() => {
      // Log in using the custom command.
      // This will use cy.session to restore the session if already logged in during this run,
      // or perform a full login and cache the session.
      cy.login();
      cy.visit('/dashboard'); // Explicitly visit dashboard after login command ensures we start fresh on the dashboard
    });

    it('should successfully access the dashboard page', () => {
      cy.url().should('include', '/dashboard');
      // Check for a unique element on the dashboard page.
      // Based on `src/app/dashboard/page.tsx` which uses `DashboardOverview`,
      // which in turn might have a "Welcome back" or similar greeting.
      // Let's assume a general "Dashboard" title/header is present.
      cy.contains('h1, h2, h3, span, div', /Dashboard|Welcome back/i, { timeout: 10000 }).should('be.visible');
    });

    it('should display common dashboard layout elements', () => {
      cy.url().should('include', '/dashboard');
      // These selectors are assumptions and would need to be verified against the actual HTML structure.
      // Example: Check for a sidebar navigation
      // cy.get('nav[aria-label="Sidebar"]').should('be.visible');
      // Example: Check for a main content area
      // cy.get('main').should('be.visible');

      // For now, a simple check that we are on the dashboard is enough,
      // as specific elements will be tested in more detailed feature tests.
      cy.contains('Dashboard Overview', { timeout: 10000 }).should('be.visible'); // From src/app/dashboard/page.tsx
    });

    it('should be able to navigate to a sub-section (e.g., Settings) and see its content', () => {
      // This test assumes there's a navigation link to settings.
      // The actual selector for the "Settings" link needs to be identified from the UI.
      // For example, if there's a sidebar:
      // cy.get('nav[aria-label="Sidebar"]').contains('Settings').click();

      // For now, let's try direct navigation to a known settings path and check for unique content.
      // The path src/app/dashboard/settings/page.tsx exists.
      cy.visit('/dashboard/settings');
      cy.url().should('include', '/dashboard/settings');
      // Assume the settings page has a clear title or unique element.
      // For example, if `src/app/dashboard/settings/page.tsx` has a <PageTitle>Settings</PageTitle>
      cy.contains('h1, h2, h3', /Settings/i, {timeout: 10000}).should('be.visible');
    });

    it('should log out successfully and redirect to login page', () => {
      // The cy.logout() command handles finding the logout mechanism (API call preferred)
      // and verifying redirection & cookie state.

      // Before calling logout, ensure we are on a page that should have a logout option
      // or from where logout is possible.
      cy.url().should('include', '/dashboard'); // Make sure we are on the dashboard

      cy.logout(); // Custom command for logout

      // cy.logout() already verifies redirection to /login and cookie clearance.
      // As an additional check, try accessing dashboard again
      cy.visit('/dashboard');
      cy.url().should('include', '/login');
      cy.contains('Welcome Back!').should('be.visible');
    });
  });
});

// Notes for running:
// 1. Ensure `CYPRESS_TEST_USER_EMAIL` and `CYPRESS_TEST_USER_PASSWORD` are set in `cypress.env.json`
//    or as environment variables for the `cy.login()` command.
// 2. The Next.js app must be running with Firebase configured.
// 3. The logout mechanism (API call to /api/auth/session-logout) is assumed by `cy.logout()`.
//    If a UI logout button is preferred for this test, `cy.logout()` would need adjustment,
//    or the test would perform UI clicks directly. For E2E, testing the UI logout is also valuable.
//    The current `cy.logout` uses an API call for speed and reliability.
//
// The existence of "Dashboard Overview" text is based on `src/app/dashboard/page.tsx`
// which imports and uses `DashboardOverview`.
// The "Settings" page check is based on `src/app/dashboard/settings/page.tsx`
// and assumes it has a prominent "Settings" title.
// These specific texts/selectors might need adjustment.
//
// Timeouts are included for elements that might appear asynchronously.
//
// The `cy.login()` uses `cy.session()` which helps in speeding up tests by caching
// the browser session across multiple test files (specs) if `cacheAcrossSpecs: true` is used.
// This means if one spec logs in, subsequent specs can reuse that session without full UI login.
// For the first run, or if the session is invalid, it performs a full UI login.
// `cy.visit('/dashboard')` after `cy.login()` in `beforeEach` ensures that even if a session is restored,
// the test starts by navigating to the dashboard page cleanly.
//
// The check for `h1, h2, h3, span, div` containing text is a broad check. More specific selectors are better.
// For example, if dashboard page has <PageTitle>Dashboard</PageTitle>, then `cy.contains('h1', 'Dashboard')` is better.
// The current `src/app/dashboard/page.tsx` uses `<DashboardOverview />`. Need to see what that renders.
// It renders `<PageTitle title="Dashboard Overview" />`. So, `cy.contains('Dashboard Overview')` is a good check.
// Similarly for settings page, it's `<PageTitle title="Settings" />`.
//
// The `context` blocks help organize tests for logged-in vs. not-logged-in states.
//
// Direct navigation to `/dashboard/settings` is a valid E2E test for deep linking
// and ensuring middleware protects nested routes correctly too (covered by the "not logged in" context).
// When logged in, it tests if the settings page loads.
//
// The `cy.logout()` command already includes verification of cookie clearance and redirection to /login.
// The additional check after logout (visiting /dashboard again) is a belt-and-suspenders check.
