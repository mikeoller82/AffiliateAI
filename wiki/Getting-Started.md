# Getting Started with HighLaunchPad

This guide will walk you through setting up HighLaunchPad on your local machine for development or self-hosting.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18.x or later (LTS recommended). You can download it from [nodejs.org](https://nodejs.org/).
*   **Package Manager:** `npm` (comes with Node.js) or `yarn`. This guide will use `npm` commands.
*   **Git:** For cloning the repository.
*   **AI API Key (Optional, for AI features):**
    *   A Google AI API key for Gemini models. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   **Database (for self-hosting full features):**
    *   The README mentions PostgreSQL. Ensure you have a running PostgreSQL instance and its connection string if you plan to use it.
    *   *(Note: `firebase` is listed as a dependency in `package.json`. Clarification on the primary backend database for self-hosting is pending. For now, prepare for PostgreSQL as per README guidance for full backend features).*
*   **Stripe Account & API Keys (Optional, for payment features):**
    *   If you intend to use or test payment features, you'll need a Stripe account and API keys.

## 1. Clone the Repository

Open your terminal and clone the HighLaunchPad repository:

```bash
git clone https://github.com/mikeoller82/HighLaunchPad.git
cd HighLaunchPad
```

## 2. Install Dependencies

Install the project dependencies using `npm` (or `yarn`):

```bash
npm install
# or
# yarn install
```
This will also run `patch-package` if any patches are defined.

## 3. Configure Environment Variables

HighLaunchPad uses environment variables for configuration. Create a `.env.local` file in the root of the project by copying the example file (if one is provided, otherwise create it manually).

```bash
cp .env.example .env.local # If .env.example exists
# or
touch .env.local          # If .env.example does not exist
```

Populate `.env.local` with the necessary values. Here are some common variables you might need:

```env
# Authentication (NextAuth.js)
# Generate a secret: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000" # Or your deployment URL

# Database (PostgreSQL example, as per README)
# DATABASE_URL="postgresql://user:password@host:port/database"

# Google AI (Genkit)
GOOGLE_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

# Stripe
STRIPE_PUBLIC_KEY="pk_YOUR_STRIPE_PUBLIC_KEY"
STRIPE_SECRET_KEY="sk_YOUR_STRIPE_SECRET_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_STRIPE_WEBHOOK_SECRET"

# Add other variables as required by the application (e.g., for specific integrations)
# Example for Firebase if used (check src/lib/firebaseConfig.ts or similar if it exists)
# NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
# NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
# ... other Firebase config
```

**Important Notes:**

*   Refer to the main `README.md` or specific documentation if available for a complete list of required environment variables.
*   The backend setup (PostgreSQL/Prisma vs. Firebase) needs clarification. The `DATABASE_URL` is based on the README's mention of PostgreSQL and Prisma. If Firebase is the primary backend for certain services, its configuration keys will also be needed.

## 4. Set Up Database (If Applicable)

If using PostgreSQL with Prisma (as suggested in the README):

*   Ensure your PostgreSQL server is running and accessible with the `DATABASE_URL` you provided.
*   Run Prisma migrations to set up the database schema:
    ```bash
    npx prisma migrate dev --name init
    # Or use 'npx prisma db push' for simpler dev setups if you're not versioning migrations yet
    ```
*   You might also need to seed the database if a seed script is provided:
    ```bash
    # npx prisma db seed (if a seed script is configured in package.json and prisma/seed.ts)
    ```

*(Developer Note: The exact Prisma setup commands might vary based on project structure. Check `package.json` or `prisma/schema.prisma` for specific instructions if available.)*

## 5. Running the Application Locally

HighLaunchPad consists of the main Next.js application and the Genkit AI services. You'll typically need to run both for full functionality.

**a) Start the Genkit AI Services:**

Open a terminal window and run:

```bash
npm run genkit:dev
# or for auto-reloading on changes:
# npm run genkit:watch
```

This will start the Genkit development server, usually on a different port (e.g., 3400), making AI flows available.

**b) Start the Next.js Development Server:**

In another terminal window, run:

```bash
npm run dev
```

This will start the Next.js application, typically on `http://localhost:3000`.

You should now be able to access HighLaunchPad in your browser.

## 6. Building for Production

When you're ready to deploy:

1.  **Build the application:**
    ```bash
    npm run build
    ```
    This command compiles the Next.js application and Genkit services for production.

2.  **Start the application in production mode:**
    ```bash
    npm run start
    ```

## 7. Deployment

The README mentions Vercel and Docker as deployment options.

*   **Vercel:** Ideal for Next.js applications. Connect your GitHub repository to Vercel for automatic deployments. Ensure your environment variables are set in the Vercel project settings.
*   **Docker:** If a `Dockerfile` is provided in the repository, you can use it to build and deploy a containerized version of the application.
*   **Self-hosting:** You can run the production build (`npm run start`) on your own server (e.g., a VPS, cloud instance) using a process manager like PM2.

Refer to specific deployment guides if they become available. Ensure your production environment has all necessary environment variables configured.

---

This guide provides a general overview. For more specific instructions, always refer to the main project `README.md` or other documentation files within the repository. If you encounter issues, check the project's GitHub Issues page or consider asking the community on Discord (link in the main README).Tool output for `create_file_with_block`:
