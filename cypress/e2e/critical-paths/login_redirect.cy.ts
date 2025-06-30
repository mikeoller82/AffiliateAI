// cypress/e2e/critical-paths/login_redirect.cy.ts

describe('Critical Path: Login and Redirect to Dashboard', () => {
  it('should successfully log in and be redirected to the dashboard', () => {
    const testUserEmail = Cypress.env('TEST_USER_EMAIL');
    const testUserPassword = Cypress.env('TEST_USER_PASSWORD');

    // Ensure credentials are provided in cypress.env.json or as environment variables
    if (!testUserEmail || !testUserPassword) {
      throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in Cypress environment variables');
    }

    // Start on the login page
    cy.visit('/login');
    cy.url().should('include', '/login');

    // Fill out and submit the login form
    cy.get('input[name="email"]').type(testUserEmail);
    cy.get('input[name="password"]').type(testUserPassword, { log: false });
    cy.get('button[type="submit"]').click();

    // Assert that the URL is now the dashboard page.
    // Increased timeout to allow for server processing and redirection.
    cy.url().should('include', '/dashboard', { timeout: 20000 });

    // Assert that key dashboard content has loaded to confirm we are on the correct page.
    // This checks for the "Dashboard Overview" title from the PageTitle component.
    cy.contains('h1, h2, h3', 'Dashboard Overview', { timeout: 15000 }).should('be.visible');

    // As a final check, verify that the session cookie was set.
    cy.getCookie('__session').should('exist');
  });
});
