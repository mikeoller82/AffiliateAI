// cypress/e2e/smoke.cy.ts

describe('Smoke Test', () => {
  it('should load the homepage', () => {
    cy.visit('/');
    cy.contains('HighLaunchPad'); // Adjust if the homepage content is different
  });

  it('should load the login page', () => {
    cy.visit('/login');
    cy.contains('Welcome Back!'); // Or other text specific to the login page
  });
});
