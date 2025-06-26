
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting compelling Call-To-Actions (CTAs) based on context.
 *
 * - suggestCTAs - A function that uses AI to suggest compelling CTAs.
 * - SuggestCTAsInput - The input type for the suggestCTAs function.
 * - SuggestCTAsOutput - The return type for the suggestCTAs function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';


const SuggestCTAsInputSchema = z.object({
  context: z.string().describe('The context of the landing page or ad, e.g., "Landing page for a free webinar on real estate".'),
});
export type SuggestCTAsInput = z.infer<typeof SuggestCTAsInputSchema>;

const SuggestCTAsOutputSchema = z.array(z.string()).describe('A list of suggested CTAs.');
export type SuggestCTAsOutput = z.infer<typeof SuggestCTAsOutput>;

export async function suggestCTAs(input: SuggestCTAsInput): Promise<SuggestCTAsOutput> {
  return suggestCTAsFlow(input);
}

const suggestCTAsFlow = ai.defineFlow(
  {
    name: 'suggestCTAsFlow',
    inputSchema: SuggestCTAsInputSchema,
    outputSchema: SuggestCTAsOutputSchema,
  },
  async ({ context }) => {
    const prompt = `You are an expert marketing assistant. You will suggest compelling CTAs for the given context.

      Context: ${context}

      Suggest 3-5 CTAs.`;

    const {output} = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: { 
            format: 'json',
            schema: SuggestCTAsOutputSchema 
        },
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
