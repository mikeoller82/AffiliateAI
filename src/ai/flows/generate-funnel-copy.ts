
'use server';
/**
 * @fileOverview An AI agent that generates copy for various funnel blocks.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';


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

export async function generateFunnelCopy(input: GenerateFunnelCopyInput): Promise<GenerateFunnelCopyOutput> {
  return generateFunnelCopyFlow(input);
}

const generateFunnelCopyFlow = ai.defineFlow(
  {
    name: 'generateFunnelCopyFlow',
    inputSchema: GenerateFunnelCopyInputSchema,
    outputSchema: GenerateFunnelCopyOutputSchema,
  },
  async ({ productDescription, copyType, userPrompt, apiKey }) => {
    const dynamicAI = apiKey ? genkit({ plugins: [googleAI({ apiKey })] }) : ai;
    
    const prompt = `You are an expert conversion copywriter designing a landing page funnel.

      The product is: ${productDescription}

      Your task is to generate a "${copyType}".

      Follow this instruction from the user: ${userPrompt}

      Generate a single, compelling piece of copy. Return ONLY the text for the copy in the 'generatedCopy' field of the JSON output.`;

    const {output} = await dynamicAI.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: GenerateFunnelCopyOutputSchema
        },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
