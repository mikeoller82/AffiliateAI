// cypress/e2e/auth/login.cy.ts

describe('Login Functionality', () => {
  const testUserEmail = Cypress.env('TEST_USER_EMAIL') || 'testuser@example.com';
  const testUserPassword = Cypress.env('TEST_USER_PASSWORD') || 'password123';
  const nonExistentUserEmail = 'nonexistent@example.com';
  const wrongPassword = 'wrongpassword';

  beforeEach(() => {
    // Ensure a clean state before each test, e.g., by logging out if a session exists.
    // For now, we'll just visit the login page.
    // A more robust solution might involve programmatically clearing cookies or session state.
    cy.visit('/login');
  });

  it('should display validation errors for empty fields', () => {
    // Attempt to submit with empty email
    cy.get('input[name="password"]').type(testUserPassword);
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email address.').should('be.visible');
    cy.url().should('include', '/login');

    // Clear password and attempt to submit with empty password
    cy.get('input[name="password"]').clear();
    cy.get('input[name="email"]').type(testUserEmail);
    cy.get('button[type="submit"]').click();
    cy.contains('Password is required.').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should fail to log in with incorrect password', () => {
    cy.get('input[name="email"]').type(testUserEmail);
    cy.get('input[name="password"]').type(wrongPassword);
    cy.get('button[type="submit"]').click();

    // Wait for potential toast message
    cy.contains('Invalid email or password', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/login');
    cy.getCookie('__session').should('not.exist');
  });

  it('should fail to log in with a non-existent user', () => {
    cy.get('input[name="email"]').type(nonExistentUserEmail);
    cy.get('input[name="password"]').type(testUserPassword);
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid email or password', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/login');
    cy.getCookie('__session').should('not.exist');
  });

  // This test depends on a pre-existing user or successful signup.
  // Ensure TEST_USER_EMAIL and TEST_USER_PASSWORD are set in cypress.env.json or environment variables.
  it('should successfully log in with valid credentials and redirect to dashboard', () => {
    if (!Cypress.env('TEST_USER_EMAIL') || !Cypress.env('TEST_USER_PASSWORD')) {
      cy.log('Skipping login test: TEST_USER_EMAIL or TEST_USER_PASSWORD not set.');
      // Skip the test if credentials are not provided
      // This is a way to prevent the test from failing if setup is incomplete.
      // In a CI environment, these should always be set.
      // For local development, you might want to throw an error or handle it differently.
      // As per instructions, "do not use mock data use real logic", so these must be real.
      // This test will effectively be skipped if they are not set.
      // Consider this a placeholder for a more robust check or a conditional skip.
      // For now, if they are not set, the test will try with default values which will likely fail
      // if those defaults don't exist, which is the desired behavior to highlight missing setup.
      // A better approach for CI might be to fail fast if env vars are missing.
      // cy.wrap(null).should(() => { throw new Error("TEST_USER_EMAIL or TEST_USER_PASSWORD not set") });
      // For now, we let it proceed with defaults if env vars are missing, to see it try.
    }

    cy.get('input[name="email"]').type(testUserEmail);
    cy.get('input[name="password"]').type(testUserPassword);
    cy.get('button[type="submit"]').click();

    // Wait for redirection and dashboard content
    cy.url().should('include', '/dashboard', { timeout: 20000 }); // Increased timeout for login and redirect
    cy.contains('Dashboard', { timeout: 10000 }); // Check for a common dashboard element

    // Verify session cookie
    cy.getCookie('__session').should('exist');
    cy.getCookie('__session').then((cookie) => {
      expect(cookie.httpOnly).to.be.true; // Or as per your setup
      expect(cookie.secure).to.equal(Cypress.config('baseUrl').startsWith('https')); // Secure if on HTTPS
      expect(cookie.sameSite).to.equal('lax'); // As set in session-login route
      expect(cookie.value).to.not.be.empty;
      expect(cookie.value).to.not.equal('dev-session'); // Ensure it's not the dev skip cookie
    });
  });

  // Add a test for the "Sign up" link
  it('should navigate to the signup page when "Sign up" link is clicked', () => {
    cy.contains('Sign up').click();
    cy.url().should('include', '/signup');
    cy.contains('Create an Account').should('be.visible');
  });

});

// Helper to ensure environment variables are loaded for Cypress tests if needed
// (though for UI tests, the server needs them primarily)
// You can set these in cypress.env.json or export them in your shell
// Example cypress.env.json:
// {
//   "TEST_USER_EMAIL": "your_test_user@example.com",
//   "TEST_USER_PASSWORD": "your_secure_password"
// }
// Remember to add cypress.env.json to .gitignore if it contains sensitive info.

// For tests to run, the Next.js app (npm run dev) must be running
// and configured with its own Firebase environment variables (from .env.local or similar).
// The FIREBASE_SERVICE_ACCOUNT_JSON is critical for the /api/auth/session-login endpoint.
// Make sure it's correctly set up in the environment where `npm run dev` is executed.
// If `FIREBASE_SERVICE_ACCOUNT_JSON` is not set or invalid, the login will fail
// at the session creation step, and these tests will reflect that.
// This is the "real logic" testing.
//
// To provision a test user:
// 1. Manually sign up via the UI if the signup page is functional.
// 2. Or, use the Firebase console to add a user to Firebase Authentication.
// Then, set CYPRESS_TEST_USER_EMAIL and CYPRESS_TEST_USER_PASSWORD.
//
// The default placeholder values 'testuser@example.com'/'password123' are unlikely to work
// without prior setup in your Firebase project.
//
// The test for successful login will likely fail until a valid test user is provisioned
// and its credentials are provided via environment variables.
// This is an expected part of "testing everything thoroughly" with "real logic".
// The failure will indicate the need to provision this user.
//
// The "Invalid email or password" toast message is assumed from common practice.
// If the actual message is different, the tests should be updated.
// The login page uses `toast` from `@/hooks/use-toast`, which renders Toaster.
// Cypress should be able to interact with these toast messages.
//
// Timeout values have been increased for operations that might take longer,
// like page loads after login or waiting for toast messages.
//
// The cookie checks are based on the setup in `session-login/route.ts`.
// `httpOnly` cannot be directly asserted by Cypress `cy.getCookie` for client-side JS,
// but its presence and other attributes can be. The server sets it as httpOnly.
// The `secure` flag check is dynamic based on whether baseUrl is HTTPS.
//
// The test for `__session` not being 'dev-session' is to ensure the dev skip in
// the API route was correctly removed or is not active.
//
// The login page HTML structure (input names, button type) is assumed from `LoginPage.tsx`.
// `input[name="email"]`, `input[name="password"]`, `button[type="submit"]`.
//
// Validation messages like "Please enter a valid email address." and "Password is required."
// are assumed from the Zod schema in `LoginPage.tsx`.
//
// The check for `cy.contains('Dashboard')` on the dashboard page is a generic check.
// This should be updated if a more specific, stable selector is available on the dashboard.
//
// The test for navigating to signup page assumes there's a link with text "Sign up".
// `SignupPage.tsx` has `<CardTitle>Create an Account</CardTitle>`.
