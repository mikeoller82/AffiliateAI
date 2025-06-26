// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Example: Add a command to easily get an element by data-testid attribute
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// It's good practice to declare the types for your custom commands
// if you're using TypeScript. Create a file like `cypress/support/index.d.ts`
// and add:
//
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
//     login(email?: string, password?: string): Chainable<void>;
//   }
// }
//
// Then, ensure this index.d.ts is referenced in your tsconfig.json for Cypress,
// or in the tsconfig.json at the root of your project if it includes Cypress types.
// Usually, adding "cypress" to "types" in tsconfig.json's compilerOptions is enough.

// For Firebase environment variables:
// Crucially, the Next.js server (npm run dev) must be started with the necessary
// NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, etc., and
// FIREBASE_SERVICE_ACCOUNT_JSON (for admin tasks like session cookies).
// Cypress itself (cy.visit()) interacts with the already running application,
// so it doesn't directly need to configure these for the app, but the app needs them.
// If you need to seed data or interact with Firebase Admin SDK *from within Cypress tests*
// (e.g. in cy.task()), then Cypress's Node environment (in setupNodeEvents)
// would need access to FIREBASE_SERVICE_ACCOUNT_JSON.

// Consider adding a type declaration file for custom commands
// (e.g., cypress/support/index.d.ts) already created as cypress/support/index.d.ts

/**
 * Custom command to log in a user through the UI.
 * Uses environment variables for credentials by default.
 * @example cy.login()
 * @example cy.login('user@example.com', 'password123')
 */
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const userEmail = email || Cypress.env('TEST_USER_EMAIL');
  const userPassword = password || Cypress.env('TEST_USER_PASSWORD');

  if (!userEmail || !userPassword) {
    throw new Error(
      'Login credentials not provided. Ensure TEST_USER_EMAIL and TEST_USER_PASSWORD are set in Cypress environment variables or passed as arguments.'
    );
  }

  cy.session([userEmail, userPassword], () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type(userPassword, { log: false }); // Don't log password
    cy.get('button[type="submit"]').click();

    // Wait for redirection and dashboard content
    cy.url().should('include', '/dashboard', { timeout: 20000 });
    cy.contains('Dashboard', { timeout: 10000 }); // A general check for dashboard
    cy.getCookie('__session').should('exist');
  }, {
    cacheAcrossSpecs: true // Cache session across multiple specs for speed
  });
});

/**
 * Custom command to log out a user.
 * Assumes a logout button/mechanism is available.
 * This needs to be adapted to how logout is implemented in the app.
 * For now, it directly calls the logout API endpoint if available,
 * or simulates UI interaction if a logout button is standard.
 */
Cypress.Commands.add('logout', () => {
  // Option 1: If there's a direct API endpoint for logout
  // This is often more robust and faster than UI interaction for logout.
  // The API endpoint /api/auth/session-logout was found earlier.
  cy.request('POST', '/api/auth/session-logout').then((response) => {
    expect(response.status).to.eq(200);
  });

  // Clear any client-side session indicators if necessary (e.g., local storage)
  // window.localStorage.removeItem('someToken'); // Example

  // Ensure cookie is cleared
  cy.getCookie('__session').should('not.exist');
  cy.visit('/login'); // Navigate to login to confirm logout state
});
