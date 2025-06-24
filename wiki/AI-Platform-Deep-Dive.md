# AI Platform Deep Dive

HighLaunchPad's AI capabilities are central to its value proposition. This page provides a more detailed look into the AI platform's architecture, components, and how developers can potentially extend it.

## Core AI Framework: Genkit

HighLaunchPad utilizes **Genkit**, a framework from Google, to build, deploy, and manage AI-powered features.

*   **Key Dependencies:**
    *   `genkit`: The core Genkit library.
    *   `@genkit-ai/googleai`: Plugin for integrating Google AI models (like Gemini).
    *   `@genkit-ai/next`: Plugin for integrating Genkit with Next.js applications.
*   **Configuration:** The main Genkit setup is typically found in `src/ai/genkit.ts`. This file initializes Genkit with necessary plugins and default model configurations.
    ```typescript
    // Example from src/ai/genkit.ts
    import {genkit} from 'genkit';
    import {googleAI} from '@genkit-ai/googleai';

    export const ai = genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.0-flash', // Or other Gemini models
    });
    ```
*   **Development Server:** Genkit comes with its own development UI, which can be started using `npm run genkit:dev` or `npm run genkit:watch`. This UI allows you to inspect flows, test them, and view traces.

## AI Flows

AI functionalities are organized into "flows." A flow is a sequence of steps that defines an AI-driven task.

*   **Location:** AI flows are defined as TypeScript files within the `src/ai/flows/` directory.
*   **Structure of a Flow (Conceptual):**
    1.  **Input Schema:** Define the expected input for the flow using a library like Zod.
    2.  **Core Logic:** Use Genkit's `defineFlow` function to create the flow. Inside, you can:
        *   Call AI models (e.g., `generateText` using the configured Gemini model).
        *   Process input and output.
        *   Integrate with other services or tools if needed.
    3.  **Output Schema:** Define the expected output of the flow.
*   **Example Flows:**
    *   `generate-funnel-copy.ts`: Takes product information and a copy type, returns generated text.
    *   `generate-email-content.ts`: Assists in drafting emails.
    *   `edit-text.ts`: For tasks like rephrasing or summarizing.
    *   *(Refer to the `src/ai/flows/` directory for the complete list and their specific implementations.)*

## Interacting with AI Flows from the Frontend

*   **Next.js Integration:** The `@genkit-ai/next` plugin facilitates calling Genkit flows from Next.js frontend components (Server Components or Client Components making API calls).
*   **Client-Side Invocation:** Typically, a client component will make an API request to a Next.js API route that, in turn, invokes the Genkit flow. Or, if using the Genkit Next.js plugin effectively, it might provide helper functions to call flows more directly.
*   **API Key Management:** The frontend handles AI API key provision, often through a context like `useAIKey` (`src/contexts/ai-key-context.tsx`) and components like `ApiKeyDialog` (`src/components/ai/api-key-dialog.tsx`). The key is then passed with requests to AI flows that require it.

## Extending the AI Platform (For Contributors)

If you want to add new AI features:

1.  **Define a New Flow:**
    *   Create a new `.ts` file in `src/ai/flows/`.
    *   Define the input and output schemas for your new AI task.
    *   Use `defineFlow` from Genkit to implement the logic. You might prompt an LLM, call other tools, or combine multiple AI calls.
    *   Example structure for a new flow `src/ai/flows/my-new-ai-task.ts`:
        ```typescript
        import { defineFlow, generateText } from 'genkit';
        import { googleAI }s from '@genkit-ai/googleai'; // if not globally configured or for specific model
        import * as z from 'zod';
        import { ai } from '../genkit'; // Assuming 'ai' is your configured Genkit instance

        // Define input schema with Zod
        export const MyTaskInputSchema = z.object({
          prompt: z.string(),
          // other inputs
        });

        // Define output schema with Zod
        export const MyTaskOutputSchema = z.object({
          result: z.string(),
        });

        export const myNewAiTask = defineFlow(
          {
            name: 'myNewAiTask',
            inputSchema: MyTaskInputSchema,
            outputSchema: MyTaskOutputSchema,
          },
          async (input) => {
            const { prompt } = input;

            const llmResponse = await generateText({
              model: ai.model, // Use the configured model
              prompt: `User prompt: ${prompt}. Perform this new AI task...`,
              // Add other generation config like temperature, candidates, etc.
            });

            return { result: llmResponse.text() };
          }
        );
        ```
2.  **Expose the Flow:**
    *   Ensure the flow is exported from its file.
    *   The Genkit Next.js plugin or your API route setup should make it callable from the frontend.
3.  **Integrate with UI:**
    *   Create or modify frontend components to gather input for the new flow.
    *   Call the flow and display its results.
    *   Handle loading states and potential errors.
4.  **Testing:**
    *   Use the Genkit Developer UI to test your flow in isolation.
    *   Write unit or integration tests if applicable.

## Current AI Model

*   As per `src/ai/genkit.ts`, the platform is configured to use a **Google Gemini model** (e.g., `googleai/gemini-2.0-flash`).
*   This provides strong generative capabilities for text-based tasks.

## Considerations

*   **Cost:** LLM API calls incur costs. Users providing their own API keys bear these costs.
*   **Rate Limiting:** Be mindful of API rate limits when designing flows that might make many calls.
*   **Prompt Engineering:** The quality of AI output heavily depends on the quality of the prompts. Iterative prompt refinement is key.
*   **Security:** If flows handle sensitive data, ensure appropriate security measures are in place. Genkit and Google Cloud offer mechanisms for this, but implementation is key.

This deep dive should provide a good starting point for understanding and working with HighLaunchPad's AI platform. For the most up-to-date details, always refer to the source code in the `src/ai/` directory.
