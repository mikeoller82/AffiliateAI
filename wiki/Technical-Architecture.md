# Technical Architecture

This document provides an overview of the technical stack and architecture of HighLaunchPad. Understanding this can be helpful for self-hosting, customization, and contributions.

## Core Technologies

HighLaunchPad is built with a modern, scalable, and developer-friendly technology stack:

*   **Frontend:**
    *   **Next.js:** A popular React framework for building server-rendered and statically generated web applications. Uses the App Router (`src/app/`).
    *   **React:** A JavaScript library for building user interfaces.
    *   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
    *   **shadcn/ui (implied):** Leverages Radix UI primitives and Tailwind CSS for a collection of accessible and customizable UI components (`src/components/ui/`).
*   **Backend (Application Logic & API):**
    *   **Node.js:** The JavaScript runtime environment used by Next.js for its backend capabilities (API routes, server components).
*   **Database:**
    *   The main `README.md` specifies **PostgreSQL** as the intended database.
    *   **Prisma ORM** is mentioned for database interaction.
    *   *(Developer Note: The `package.json` includes a `firebase` dependency. The exact role of Firebase (e.g., for Auth, Firestore/Realtime Database, or specific microservices) versus PostgreSQL needs clarification. For a full self-hosted setup aiming for the described CRM/data features, PostgreSQL with Prisma is the assumed primary data store based on the README.)*
*   **AI Layer:**
    *   **Genkit (Google):** (`genkit`, `@genkit-ai/googleai`, `@genkit-ai/next` dependencies) A framework for building AI-powered features. Used for defining and managing AI flows (`src/ai/flows/`).
    *   **Google Gemini Models:** Configured to use Google's Gemini models (e.g., `googleai/gemini-2.0-flash` as per `src/ai/genkit.ts`) for generative AI tasks.
    *   The README also mentions "LangChain ready," suggesting potential future or alternative integrations.
*   **Authentication:**
    *   The README mentions options like **NextAuth.js, Clerk, or Supabase Auth**.
    *   NextAuth.js is a common choice for Next.js applications and aligns with a self-hosted Node.js backend.
    *   *(Developer Note: If `firebase` is used, Firebase Authentication might also be a component.)*

## Key Libraries & Tools

*   **UI & Interaction:**
    *   **Lucide React:** For icons.
    *   **Tiptap:** (`@tiptap/*` dependencies) A headless rich text editor, used for the Notion-Style Pad and potentially other text editing surfaces.
    *   **Reactflow:** For building node-based editors, used in the Workflow Automation Builder.
    *   **DND Kit (`@dnd-kit/core`, `@dnd-kit/sortable`):** For drag-and-drop functionality, likely used in the Funnel Builder and other visual editors.
    *   **Recharts:** For displaying charts and data visualizations.
*   **Forms & Validation:**
    *   **React Hook Form:** For managing form state and submissions.
    *   **Zod:** For schema declaration and validation.
*   **Payments:**
    *   **Stripe (`@stripe/stripe-js`):** For integrating payment processing.
*   **Development & Build:**
    *   **TypeScript:** For static typing.
    *   **ESLint & Prettier:** For code linting and formatting (standard in Next.js projects).
    *   **Turbopack (Next.js):** Used for faster development builds (`npm run dev`).
    *   **Patch Package:** For applying patches to npm module dependencies.

## Project Structure Overview

The codebase is organized as follows:

*   **`public/`:** Static assets (images, fonts, etc.).
*   **`src/`:** Main application source code.
    *   **`ai/`:** Genkit AI configuration and flows.
        *   `genkit.ts`: Main Genkit setup.
        *   `flows/`: Individual AI task definitions (e.g., `generate-funnel-copy.ts`).
    *   **`app/`:** Next.js App Router. Contains page routes, layouts, and server/client components for different views.
        *   `dashboard/`: Core application views after login, structured by feature (e.g., `crm/`, `funnels/`, `email/`).
        *   `api/`: Backend API routes (if any are not handled by Server Actions or Genkit HTTP endpoints).
    *   **`components/`:** Reusable React components.
        *   `ui/`: Base UI elements (Button, Card, Input, etc.), likely from shadcn/ui.
        *   Feature-specific components (e.g., `funnels/`, `crm/`, `notionpad/`).
    *   **`contexts/`:** React Context providers for global state (e.g., `AuthContext`, `AIKeyContext`).
    *   **`hooks/`:** Custom React hooks.
    *   **`lib/`:** Utility functions, library configurations, constants, and data structures.
        *   `utils.ts`: General helper functions.
        *   `stripe.ts`: Stripe client setup.
        *   `*-templates.ts`: Default data or templates for features like funnels, emails.
        *   `builder-types.ts`: Type definitions for builder components.
    *   **`prisma/` (Expected, if using Prisma):**
        *   `schema.prisma`: Prisma schema definition.
        *   `migrations/`: Database migration files.
*   **`docs/`:** Documentation files like `blueprint.md`.
    *   *(Developer Note: The main README links to `BUSINESS_PLAN.md`, `ARCHITECTURE.md`, `ROADMAP.md`, and `LEGAL.md` at the root level. These files were not found during the initial file listing and would be valuable additions here.)*
*   **Configuration Files (Root):**
    *   `next.config.ts`: Next.js configuration.
    *   `tailwind.config.ts`: Tailwind CSS configuration.
    *   `tsconfig.json`: TypeScript configuration.
    *   `package.json`: Project dependencies and scripts.
    *   `.env.local`: Local environment variables (not committed to Git).

## Deployment

*   **Vercel:** Recommended for Next.js applications, offering seamless deployment and scaling.
*   **Docker:** A `Dockerfile` may be provided or can be created for containerized deployments.
*   **Self-hosted:** The application can be built (`npm run build`) and run (`npm run start`) on any Node.js-compatible server.

This architecture is designed to be modular and scalable, allowing for the addition of new features and integrations over time. For more detailed information on specific parts of the system, refer to the source code and comments within the respective directories.
