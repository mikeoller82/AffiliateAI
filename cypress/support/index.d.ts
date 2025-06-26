// cypress/support/index.d.ts

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('submit-button')
     */
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to log in a user through the UI.
     * Typically involves visiting the login page, filling credentials, and submitting.
     * Credentials can be passed as arguments or use environment variables.
     * @example cy.login('user@example.com', 'password123')
     * @example cy.login() // Using env vars
     */
    login(email?: string, password?: string): Chainable<void>;

    // Add other custom command type definitions here
  }
}
