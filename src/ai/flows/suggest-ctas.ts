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


export const SuggestCTAsOutputSchema = z.array(z.string()).describe('A list of suggested CTAs.');
export type SuggestCTAsOutput = z.infer<typeof SuggestCTAsOutputSchema>;


export async function suggestCTAs(input: SuggestCTAsInput): Promise<SuggestCTAsOutput> {
    const { context, apiKey } = input;
    
    const prompt = `You are a world-class expert in Marketing Strategy.
Suggest 3-5 compelling Call-To-Actions (CTAs) for the given context.

**Context:** ${context}

Return ONLY a raw JSON array of strings.`;
    
    const { output } = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: SuggestCTAsOutputSchema,
        },
        pluginOptions: apiKey ? { googleai: { apiKey } } : undefined,
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
}
