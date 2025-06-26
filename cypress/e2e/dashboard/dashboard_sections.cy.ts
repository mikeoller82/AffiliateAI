// cypress/e2e/dashboard/dashboard_sections.cy.ts

describe('Dashboard Sections Smoke Tests', () => {
  beforeEach(() => {
    // Log in before each test using the custom command.
    // cy.session will optimize this by restoring the session if available.
    cy.login();
    // It's good practice to start at the main dashboard page before navigating elsewhere
    // unless the test is specifically about deep linking after login.
    cy.visit('/dashboard');
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard Overview', { timeout: 10000 }).should('be.visible');
  });

  const sections = [
    // Key sections based on README and common CRM/Marketing platform features
    { name: 'AI Tools', path: '/dashboard/ai-tools', expectedContent: /AI Tools|Generative AI Playground/i, pageTitleTestId: 'ai-tools-page-title'},
    { name: 'Automations', path: '/dashboard/automations', expectedContent: /Automations|Workflow Builder/i, pageTitleTestId: 'automations-page-title' },
    { name: 'Blog', path: '/dashboard/blog', expectedContent: /Blog Posts|Manage Your Blog/i, pageTitleTestId: 'blog-page-title' },
    // { name: 'Conversations', path: '/dashboard/conversations', expectedContent: /Conversations|Inbox/i, pageTitleTestId: 'conversations-page-title' },
    // { name: 'Courses', path: '/dashboard/courses', expectedContent: /Courses|Your Courses/i, pageTitleTestId: 'courses-page-title' },
    { name: 'CRM', path: '/dashboard/crm', expectedContent: /CRM|Contacts Dashboard/i, pageTitleTestId: 'crm-page-title' },
    // { name: 'Docs', path: '/dashboard/docs', expectedContent: /Documents|Knowledge Base/i, pageTitleTestId: 'docs-page-title' },
    { name: 'Email Marketing', path: '/dashboard/email', expectedContent: /Email Marketing|Campaigns/i, pageTitleTestId: 'email-page-title' },
    { name: 'Forms', path: '/dashboard/forms', expectedContent: /Forms|Form Builder/i, pageTitleTestId: 'forms-page-title' },
    { name: 'Funnels', path: '/dashboard/funnels', expectedContent: /Funnels|Funnel Builder/i, pageTitleTestId: 'funnels-page-title' },
    // { name: 'Links', path: '/dashboard/links', expectedContent: /Links|Link Management/i, pageTitleTestId: 'links-page-title' },
    // { name: 'Newsletter', path: '/dashboard/newsletter', expectedContent: /Newsletter|Subscribers/i, pageTitleTestId: 'newsletter-page-title' },
    { name: 'Notion Pad', path: '/dashboard/notion-pad', expectedContent: /Notion Pad|Your Notes/i, pageTitleTestId: 'notion-pad-page-title' },
    { name: 'Settings', path: '/dashboard/settings', expectedContent: /Settings|Account Settings/i, pageTitleTestId: 'settings-page-title' }, // Already partially tested
    // { name: 'Social Scheduler', path: '/dashboard/social-scheduler', expectedContent: /Social Scheduler|Calendar/i, pageTitleTestId: 'social-scheduler-page-title' },
    { name: 'Websites', path: '/dashboard/websites', expectedContent: /Websites|Site Builder/i, pageTitleTestId: 'websites-page-title' }
  ];

  sections.forEach(section => {
    it(`should navigate to ${section.name} and display its main page`, () => {
      // Attempt navigation through UI if a clear navigation element exists, e.g., a sidebar.
      // For robustness and simplicity in smoke tests, direct navigation is also acceptable.
      // Example: cy.get('nav').contains(section.name).click();
      // If direct navigation:
      cy.visit(section.path);
      cy.url().should('include', section.path);

      // Check for a page title or unique heading.
      // This assumes that each section page has a <PageTitle title="Section Name" /> component
      // or a similar identifiable h1/h2 element.
      // Using a data-testid on the PageTitle component would be more robust.
      // For now, we rely on text content.
      // Example: cy.getByTestId(section.pageTitleTestId).should('contain.text', section.name);
      cy.contains('h1, h2, h3, [data-testid="page-title"]', section.expectedContent, { timeout: 15000 }).should('be.visible');

      // Add a small delay or a check for a specific element if content loads asynchronously
      // cy.wait(500); // Avoid arbitrary waits if possible
      // cy.get('[data-testid="loaded-content-indicator"]').should('be.visible');
    });
  });

  // After all section tests, good to ensure logout still works
  after(() => {
    cy.logout();
  });
});

// Notes:
// - This file provides smoke tests for various dashboard sections.
// - It uses the `cy.login()` custom command.
// - For each section, it navigates (currently by direct cy.visit) and checks for expected content (e.g., page title).
// - The `expectedContent` regex and `pageTitleTestId` are placeholders and need to be verified/updated
//   based on the actual content of each dashboard page. Using `data-testid` attributes on page titles
//   or unique wrapper elements would make these tests more robust.
// - The list of sections is representative; more can be added following the same pattern.
// - A more E2E approach would involve clicking navigation links in a sidebar if one exists,
//   rather than direct `cy.visit()` for each section after the initial dashboard load.
//   However, for smoke testing reachability, direct visit is often sufficient and less brittle
//   to UI navigation changes.
// - The `after()` hook ensures logout after all tests in this spec file.
// - Timeouts are increased for page content assertions as some pages might have more complex data loading.
// - The `expectedContent` uses a regex for flexibility (e.g. "AI Tools" or "Generative AI Playground").
//   This should match what the `PageTitle` component or a main heading on the page displays.
//   For example, if `src/app/dashboard/ai-tools/page.tsx` has `<PageTitle title="AI Tools" />`,
//   then `expectedContent: /AI Tools/i` would work.
//
// To make this truly "thorough" for each section:
// - Identify key UI elements (buttons, forms, tables, etc.).
// - Test basic CRUD operations if applicable (e.g., create a new CRM contact, create a new Funnel).
// - Test interactions with AI features if they are core to a section.
// - This would significantly expand the number of test files and cases.
//   The current approach is a first pass for reachability and basic rendering.
//
// Example of how a PageTitle component might be structured in the application:
// const PageTitle = ({ title }) => <h1 data-testid="page-title">{title}</h1>;
// Then the test could use: cy.getByTestId('page-title').should('contain.text', section.name);
// (Assuming getByTestId is defined as `cy.get('[data-testid="..."]')`)
//
// The current `src/components/ui/sidebar.tsx` defines `MENU_ITEMS`. The `href` and `label` from there
// can be used to verify navigation links and target pages.
// For example, CRM is: { label: 'CRM', href: '/dashboard/crm', icon: Users }
// Funnels is: { label: 'Funnels', href: '/dashboard/funnels', icon: Network }
// This means checking for `<h1>CRM</h1>` or `<h1>Funnels</h1>` (or similar from PageTitle) is a good start.
// The `PageTitle` component seems to be used consistently, e.g. in `src/app/dashboard/funnels/page.tsx`
// it's `<PageTitle title="Funnels" actionButton={<CreateFunnelDialog />} />`. So checking for the title is good.
// The expected content has been updated to reflect these titles.
//
// Some sections are commented out to keep the initial run manageable. They can be enabled as needed.
