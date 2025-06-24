# Contributing to HighLaunchPad

Thank you for your interest in contributing to HighLaunchPad! We welcome contributions from the community to help make this platform the best open-source AI CRM for the creator economy.

Whether you're a developer, designer, writer, or user with feedback, there are many ways to contribute.

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating. We expect all contributors to adhere to it to ensure a welcoming and inclusive environment.
*(Developer Note: A `CODE_OF_CONDUCT.md` file should be created in the root of the repository. If it doesn't exist, this link will be broken. Standard templates like the Contributor Covenant can be used.)*

## How to Contribute

Here are some ways you can contribute:

*   **Reporting Bugs:** If you find a bug, please open an issue on our [GitHub Issues page](https://github.com/mikeoller82/HighLaunchPad/issues). Provide as much detail as possible, including steps to reproduce, your environment, and expected vs. actual behavior.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue and describe your suggestion.
*   **Writing Code:** Help us build new features, fix bugs, or improve performance.
*   **Improving Documentation:** Enhance our README, Wiki, or code comments.
*   **UI/UX Design:** Provide feedback on the user interface and experience, or contribute design mockups.
*   **Testing:** Help test new releases or specific features and report any problems.

## Setting Up Your Development Environment

1.  **Fork the Repository:** Click the "Fork" button at the top right of the [HighLaunchPad GitHub page](https://github.com/mikeoller82/HighLaunchPad) to create your own copy.
2.  **Clone Your Fork:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/HighLaunchPad.git
    cd HighLaunchPad
    ```
3.  **Add Upstream Remote:**
    ```bash
    git remote add upstream https://github.com/mikeoller82/HighLaunchPad.git
    ```
4.  **Install Dependencies & Configure:** Follow the instructions in the [Getting Started](Getting-Started.md) guide to install dependencies and set up your `.env.local` file.
5.  **Run Development Servers:** You'll typically need to run the Next.js app and the Genkit AI services:
    *   Next.js: `npm run dev`
    *   Genkit: `npm run genkit:watch` (in a separate terminal)

## Coding Standards

*   **TypeScript:** The project is written in TypeScript. Please follow TypeScript best practices.
*   **ESLint & Prettier:** We use ESLint for linting and Prettier for code formatting. Configurations are in the project root. Please ensure your code adheres to these standards. Many IDEs can be configured to auto-format on save.
    *   You can run `npm run lint` to check for linting issues.
*   **Code Comments:** Write clear and concise comments where necessary, especially for complex logic.
*   **Component Structure:** Follow the existing patterns for organizing components and application logic.

## Branching Strategy

We generally follow a Gitflow-like branching strategy:

1.  **`main`:** This branch represents the latest stable release. Direct pushes are restricted.
2.  **`develop` (or similar):** This is the primary development branch where features are integrated. *(Developer Note: Confirm the name of the main development branch, e.g., `develop`, `dev`)*
3.  **Feature Branches:** Create a new branch from `develop` for each new feature or bug fix.
    *   Branch naming convention: `feature/your-feature-name` or `fix/bug-description`.
    *   Example: `git checkout -b feature/new-dashboard-widget develop`

## Submitting Pull Requests (PRs)

1.  **Keep your `develop` branch up-to-date:**
    ```bash
    git checkout develop
    git pull upstream develop
    ```
2.  **Create your feature branch from `develop` and make your changes.**
3.  **Commit your changes with clear and descriptive commit messages.**
    *   Follow conventional commit message formats if possible (e.g., `feat: Add X feature`, `fix: Resolve Y bug`).
4.  **Push your feature branch to your fork:**
    ```bash
    git push origin feature/your-feature-name
    ```
5.  **Open a Pull Request:**
    *   Go to your fork on GitHub and click the "New pull request" button.
    *   Ensure the base branch is `develop` (or the main development branch) on the `mikeoller82/HighLaunchPad` repository, and the compare branch is your feature branch.
    *   Provide a clear title and description for your PR, explaining the changes and linking to any relevant issues (e.g., "Closes #123").
6.  **Code Review:** Your PR will be reviewed by maintainers. Be prepared to discuss your changes and make adjustments if requested.
7.  **Merge:** Once approved, your PR will be merged into the development branch.

## Key Areas for Contribution

*   **Frontend (Next.js/React):** Building new UI components, improving existing interfaces, enhancing responsiveness.
*   **Backend (API Routes, Server Actions, Database):** Developing new API endpoints, optimizing database queries (Prisma/PostgreSQL), improving authentication.
*   **AI Features (Genkit):** Creating new AI flows, improving existing prompts, integrating new AI models or tools.
*   **Documentation:** Writing guides, tutorials, API documentation, or improving existing wiki pages.
*   **Testing:** Adding unit tests, integration tests, or end-to-end tests.

## Contributor Recognition

*   The main README mentions "Equity participation for major contributors." Details on this program should be sought from the project maintainers.

We appreciate your contributions and look forward to building HighLaunchPad together! If you have any questions, feel free to ask in the [Discord Community](https://discord.gg/yourlink) (replace `yourlink` with the actual Discord invite from the main README) or open an issue.
