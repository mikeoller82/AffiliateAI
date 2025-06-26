// cypress/e2e/auth/signup.cy.ts

import { nanoid } from 'nanoid';

describe('Signup Functionality', () => {

  beforeEach(() => {
    // For signup, we usually want to start fresh, not logged in.
    // If a previous test left a session, explicitly log out.
    // However, cy.session in login command might persist.
    // To be safe, we can clear cookies related to session if needed,
    // but a visit to /signup should ideally not be affected by an existing session.
    // cy.clearCookie('__session'); // Optional: if needed
    cy.visit('/signup');
  });

  it('should display validation errors for invalid or empty fields', () => {
    // Attempt to submit with empty email
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email address.').should('be.visible');
    cy.url().should('include', '/signup');

    // Attempt with invalid email
    cy.get('input[name="email"]').clear().type('invalidemail');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email address.').should('be.visible');
    cy.url().should('include', '/signup');

    // Attempt to submit with empty password
    cy.get('input[name="email"]').clear().type(`test-${nanoid()}@example.com`);
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 6 characters.').should('be.visible'); // Based on Zod schema in SignupPage.tsx
    cy.url().should('include', '/signup');

    // Attempt with too short password
    cy.get('input[name="email"]').clear().type(`test-${nanoid()}@example.com`);
    cy.get('input[name="password"]').clear().type('123');
    cy.get('button[type="submit"]').click();
    cy.contains('Password must be at least 6 characters.').should('be.visible');
    cy.url().should('include', '/signup');
  });

  it('should successfully sign up a new user and redirect to dashboard', () => {
    const uniqueEmail = `test.user.${nanoid()}@example.com`;
    const password = 'password123Valid';

    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for redirection and dashboard content
    cy.url().should('include', '/dashboard', { timeout: 20000 }); // Increased timeout for signup, session creation and redirect
    cy.contains('Dashboard Overview', { timeout: 10000 }); // Check for a common dashboard element

    // Verify session cookie
    cy.getCookie('__session').should('exist');
    cy.getCookie('__session').then((cookie) => {
      expect(cookie.value).to.not.be.empty;
      expect(cookie.value).to.not.equal('dev-session');
    });

    // Optional: Log out the newly created user to clean up.
    // This ensures the next test run (e.g. login test with a fixed user) isn't affected
    // if this user's session somehow persists in a way that cy.session in login doesn't override.
    // It also tests the logout flow immediately after signup.
    cy.logout(); // Assumes cy.logout() is available and works
    cy.url().should('include', '/login'); // cy.logout() should redirect to login
  });

  it('should fail to sign up with an email that already exists', () => {
    // This test requires a user to be pre-existing.
    // We can use the TEST_USER_EMAIL for this, assuming it's provisioned.
    const existingEmail = Cypress.env('TEST_USER_EMAIL');
    const password = 'password123';

    if (!existingEmail) {
      cy.log('Skipping test for existing email: TEST_USER_EMAIL not set.');
      // this.skip(); // Skips the test. Requires "function()" instead of "() =>" for describe/it.
      return; // Simple return to not execute further.
    }

    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Check for error message
    // The error message "This email address is already in use." comes from SignupPage.tsx
    cy.contains('This email address is already in use.', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/signup');
    cy.getCookie('__session').should('not.exist');
  });

  it('should navigate to the login page when "Log in" link is clicked', () => {
    cy.contains('Log in').click(); // Assumes link text is "Log in"
    cy.url().should('include', '/login');
    cy.contains('Welcome Back!').should('be.visible');
  });

});

// Notes:
// - Using `nanoid` to generate unique email addresses for each signup test run.
//   This avoids conflicts if tests are run multiple times without cleaning the Firebase users.
//   `nanoid` is already a dependency in package.json.
// - Assumes `cy.logout()` command is defined and works.
// - The test for "email already exists" relies on `CYPRESS_TEST_USER_EMAIL` being set and
//   that user actually existing in Firebase.
// - Validation messages are based on the Zod schema in `src/app/signup/page.tsx`.
// - Redirection to `/dashboard` and presence of "Dashboard Overview" is checked post-signup.
// - Cookie `__session` is verified.
// - Navigation to login page link is also tested.
// - Timeouts are included for async operations.
// - This test creates new users in Firebase. Consider a cleanup strategy if running frequently
//   against a production Firebase project (ideally, use a dedicated test project).
//   For now, no automated cleanup is implemented in these tests.
// - `cy.logout()` at the end of successful signup is a good practice for test hygiene.
