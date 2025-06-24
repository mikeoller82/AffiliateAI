# Feature: AI-Powered Content Engine

HighLaunchPad integrates a powerful AI Content Engine to assist you in creating compelling marketing copy, generating ideas, and automating content-related tasks. This engine is powered by Google's Genkit framework and utilizes advanced language models like Gemini.

## Overview

The AI capabilities are woven into various parts of the platform, most notably within content editors like the Funnel Builder and potentially others (e.g., Email Editor, Notion-Style Pad).

Key aspects:

*   **Genkit Framework:** Uses Google's Genkit (`genkit`, `@genkit-ai/googleai`, `@genkit-ai/next` dependencies) to define and manage AI flows.
*   **Google Gemini Models:** Leverages powerful models like `googleai/gemini-2.0-flash` (as seen in `src/ai/genkit.ts`).
*   **Contextual Generation:** AI tools often take context (e.g., product descriptions provided by you) to generate more relevant content.
*   **Specific AI Flows:** The system has pre-defined AI flows for common marketing tasks, located in `src/ai/flows/`.

## Using the AI Content Engine

### 1. API Key Configuration

To use the AI features, you need a Google AI API key:

*   Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   Store this key in your `.env.local` file as `GOOGLE_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"`.
*   Some parts of the application might use an `ApiKeyDialog` (from `src/components/ai/api-key-dialog.tsx`) managed by `useAIKey` context (`src/contexts/ai-key-context.tsx`) to prompt you for the key if it's not found or if you wish to change it.

### 2. Accessing AI Tools

AI assistance is typically found within content creation or editing interfaces. For example, in the [Funnel Builder](Core-Features-Drag-and-Drop-Funnel-Builder.md):

*   When editing a component (e.g., Hero, Text Block), the edit dialog will have an "AI Assistant" tab.
*   Here, you can select the type of content to generate (e.g., "Headline", "Subtitle", "Button Text").
*   You can provide an optional prompt to guide the AI further (e.g., "Make it more exciting," "Focus on scarcity").
*   The AI uses the "Product/Offer Description" (set in the Funnel's Settings tab) as primary context.

### 3. Available AI Flows (Examples)

The `src/ai/flows/` directory indicates the types of AI-driven tasks HighLaunchPad can perform. These may include:

*   **`generate-funnel-copy.ts`:** Generates various copy elements for sales funnels (headlines, subtitles, CTAs) based on a product description.
*   **`generate-email-content.ts`:** Assists in drafting email sequences or individual marketing emails.
*   **`generate-ad-copy.ts`:** Creates advertising copy for platforms like Facebook, Google Ads, etc.
*   **`suggest-ctas.ts`:** Suggests high-converting Call-to-Action phrases.
*   **`edit-text.ts`:** Provides general text editing capabilities like summarization, rephrasing, or changing tone.
*   **`generate-image.ts`:** Potentially integrates with services like Leonardo.ai (as hinted by `next.config.ts`) to generate images based on prompts. *(Developer Note: The exact functionality of this flow needs to be confirmed based on its implementation).*
*   **`generate-product-hook.ts`:** Helps create engaging hooks or opening statements for product descriptions or videos.
*   **`generate-product-review.ts`:** Could assist in drafting templates or outlines for product reviews.

*(The exact list and functionality of each flow would be best confirmed by inspecting the code within each file in `src/ai/flows/`.)*

### 4. How it Works (General Idea)

1.  **Input:** You provide context (e.g., product description, target audience) and a prompt or desired output type.
2.  **Processing:** HighLaunchPad sends this information to the configured Genkit AI flow.
3.  **AI Model:** Genkit, using the Google Gemini model, processes the request.
4.  **Output:** The AI generates the content (text, suggestions, etc.).
5.  **Application:** You can then review the AI-generated content and choose to use it, edit it further, or regenerate it.

## Benefits

*   **Save Time:** Quickly generate drafts for various marketing materials.
*   **Overcome Writer's Block:** Get ideas and starting points for your copy.
*   **Optimize Content:** Potentially leverage AI to suggest improvements or variations.
*   **Consistency:** Maintain a consistent tone and message with AI assistance.

The AI Content Engine is a core part of HighLaunchPad's value proposition, aiming to make content creation faster, easier, and more effective for digital entrepreneurs. As the platform evolves, expect more sophisticated AI tools and deeper integrations.
