// cypress/support/e2e.ts
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
// import './commands'

// Alternatively, you can require() commands.js as if it were a
// CommonJS module:
// require('./commands')

// Optional: If you want to ensure .env.local variables are loaded for Cypress tests,
// you might need to configure it in cypress.config.ts or via a plugin if testing locally.
// For server-side parts, ensure your server started with these vars is accessible.

// Example of a custom command (uncomment to use)
// Cypress.Commands.add('login', (email, password) => {
//   cy.visit('/login');
//   cy.get('input[name="email"]').type(email);
//   cy.get('input[name="password"]').type(password);
//   cy.get('button[type="submit"]').click();
//   cy.url().should('include', '/dashboard');
// });
import './commands'
