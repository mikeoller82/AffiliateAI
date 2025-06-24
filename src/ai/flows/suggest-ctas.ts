
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting compelling Call-To-Actions (CTAs) based on context.
 *
 * - suggestCTAs - A function that uses AI to suggest compelling CTAs.
 * - SuggestCTAsInput - The input type for the suggestCTAs function.
 * - SuggestCTAsOutput - The return type for the suggestCTAs function.
 */

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const SuggestCTAsInputSchema = z.object({
  context: z.string().describe('The context of the landing page or ad, e.g., "Landing page for a free webinar on real estate".'),
  apiKey: z.string().describe('A Google AI API key for authentication.'),
});
export type SuggestCTAsInput = z.infer<typeof SuggestCTAsInputSchema>;

const SuggestCTAsOutputSchema = z.array(z.string()).describe('A list of suggested CTAs.');
export type SuggestCTAsOutput = z.infer<typeof SuggestCTAsOutputSchema>;

export async function suggestCTAs(input: SuggestCTAsInput): Promise<SuggestCTAsOutput> {
  return suggestCTAsFlow(input);
}

const promptTemplate = `You are an expert marketing assistant. You will suggest compelling CTAs for the given context.

Context: {{{context}}}

Suggest 3-5 CTAs.`;

const suggestCTAsFlow = ai.defineFlow(
  {
    name: 'suggestCTAsFlow',
    inputSchema: SuggestCTAsInputSchema,
    outputSchema: SuggestCTAsOutputSchema,
  },
  async input => {
     const authAi = genkit({
      plugins: [googleAI({ apiKey: input.apiKey })],
      model: 'googleai/gemini-2.0-flash',
    });

    const {output} = await authAi.generate({
        prompt: promptTemplate,
        input: input,
        output: { schema: SuggestCTAsOutputSchema },
    });
    return output!;
  }
);
