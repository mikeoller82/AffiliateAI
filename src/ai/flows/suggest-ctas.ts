'use server';
/**
 * @fileOverview An AI agent that suggests calls to action.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';

export const SuggestCTAsInputSchema = z.object({
  context: z.string().describe('The context of the landing page or ad, e.g., "Landing page for a free webinar on real estate".'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type SuggestCTAsInput = z.infer<typeof SuggestCTAsInputSchema>;


export const SuggestCTAsOutputSchema = z.object({
    ctas: z.array(z.string()).describe('A list of suggested CTA strings.')
});
export type SuggestCTAsOutput = z.infer<typeof SuggestCTAsOutputSchema>;

const suggestCTAsPrompt = ai.definePrompt({
    name: 'suggestCTAsPrompt',
    input: { schema: SuggestCTAsInputSchema },
    output: { schema: SuggestCTAsOutputSchema },
    prompt: `You are a world-class expert in Marketing Strategy.
Suggest 3-5 compelling Call-To-Actions (CTAs) for the given context.

**Context:** {{{context}}}`
});

const suggestCTAsFlow = ai.defineFlow(
  {
    name: 'suggestCTAsFlow',
    inputSchema: SuggestCTAsInputSchema,
    outputSchema: SuggestCTAsOutputSchema,
  },
  async (input) => {
    const { output } = await suggestCTAsPrompt(input, {
        model: 'googleai/gemini-2.0-flash',
        pluginOptions: input.apiKey ? { googleai: { apiKey: input.apiKey } } : undefined,
    });
    
    if (!output) {
      throw new Error("AI failed to suggest CTAs.");
    }
    return output;
  }
);


export async function suggestCTAs(input: SuggestCTAsInput): Promise<SuggestCTAsOutput> {
    return await suggestCTAsFlow(input);
}
