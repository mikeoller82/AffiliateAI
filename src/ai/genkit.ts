
'use server';
/**
 * @fileOverview Centralized Genkit AI configuration.
 *
 * This file initializes a singleton `ai` object that is used throughout the
 * application to interact with generative models. It ensures that Genkit is
 * configured only once.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// The plugin will automatically look for the GOOGLE_API_KEY environment variable.
export const ai = genkit({
  plugins: [googleAI()],
});
