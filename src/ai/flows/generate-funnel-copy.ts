'use server';
/**
 * @fileOverview An AI agent that generates copy for various funnel blocks.
 *
 * - generateFunnelCopy - A function that handles the copy generation process.
 * - GenerateFunnelCopyInput - The input type for the generateFunnelCopy function.
 * - GenerateFunnelCopyOutput - The return type for the generateFunnelCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateFunnelCopyInputSchema = z.object({
  productDescription: z.string().describe('A brief description of the product or service being offered in the funnel.'),
  copyType: z.string().describe('The type of copy to generate, e.g., "Hero Headline", "Feature Description", "CTA Button Text".'),
  userPrompt: z.string().describe('A specific instruction from the user on how to generate the copy, e.g., "Make it sound more exclusive" or "Focus on the pain point of disorganization".'),
});
export type GenerateFunnelCopyInput = z.infer<typeof GenerateFunnelCopyInputSchema>;

export const GenerateFunnelCopyOutputSchema = z.object({
  generatedCopy: z.string().describe('The generated piece of copy.'),
});
export type GenerateFunnelCopyOutput = z.infer<typeof GenerateFunnelCopyOutputSchema>;

export async function generateFunnelCopy(input: GenerateFunnelCopyInput): Promise<GenerateFunnelCopyOutput> {
  return generateFunnelCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFunnelCopyPrompt',
  input: {schema: GenerateFunnelCopyInputSchema},
  output: {schema: GenerateFunnelCopyOutputSchema},
  prompt: `You are an expert conversion copywriter designing a landing page funnel.

  The product is: {{{productDescription}}}

  Your task is to generate a "{{copyType}}".

  Follow this instruction from the user: {{{userPrompt}}}

  Generate a single, compelling piece of copy. Return ONLY the text for the copy.
  `,
});

const generateFunnelCopyFlow = ai.defineFlow(
  {
    name: 'generateFunnelCopyFlow',
    inputSchema: GenerateFunnelCopyInputSchema,
    outputSchema: GenerateFunnelCopyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
