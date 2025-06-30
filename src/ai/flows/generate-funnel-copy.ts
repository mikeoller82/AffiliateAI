'use server';
/**
 * @fileOverview An AI agent that generates copy for various funnel blocks.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';


const GenerateFunnelCopyInputSchema = z.object({
  productDescription: z.string().describe('A brief description of the product or service being offered in the funnel.'),
  copyType: z.string().describe('The type of copy to generate, e.g., "Hero Headline", "Feature Description", "CTA Button Text".'),
  userPrompt: z.string().describe('A specific instruction from the user on how to generate the copy, e.g., "Make it sound more exclusive" or "Focus on the pain point of disorganization".'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateFunnelCopyInput = z.infer<typeof GenerateFunnelCopyInputSchema>;

const GenerateFunnelCopyOutputSchema = z.object({
  generatedCopy: z.string().describe('The generated piece of copy.'),
});
export type GenerateFunnelCopyOutput = z.infer<typeof GenerateFunnelCopyOutputSchema>;


const funnelCopyPrompt = ai.definePrompt({
    name: 'funnelCopyPrompt',
    input: { schema: GenerateFunnelCopyInputSchema },
    output: { schema: GenerateFunnelCopyOutputSchema },
    prompt: `You are an expert conversion copywriter designing a landing page funnel.

The product is: {{{productDescription}}}

Your task is to generate a "{{{copyType}}}".

Follow this instruction from the user: {{{userPrompt}}}

Generate a single, compelling piece of copy.`
});


const generateFunnelCopyFlow = ai.defineFlow(
  {
    name: 'generateFunnelCopyFlow',
    inputSchema: GenerateFunnelCopyInputSchema,
    outputSchema: GenerateFunnelCopyOutputSchema,
  },
  async (input) => {
    const { output } = await funnelCopyPrompt(input, {
        model: 'googleai/gemini-2.0-flash',
        pluginOptions: input.apiKey ? { googleai: { apiKey: input.apiKey } } : undefined,
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response for funnel copy.");
    }
    return output;
  }
);


export async function generateFunnelCopy(input: GenerateFunnelCopyInput): Promise<GenerateFunnelCopyOutput> {
    return await generateFunnelCopyFlow(input);
}
