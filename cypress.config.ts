import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false, // Disable video recording for now to save resources
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // require('dotenv').config({ path: '.env.local' }); // Potentially load .env.local
      // config.env = { ...config.env, ...process.env }; // Make env vars available in Cypress tests

      // It's good practice to return the config object
      // as it might have been modified by the plugin.
      return config;
    },
  },
});
