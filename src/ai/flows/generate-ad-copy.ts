'use server';
/**
 * @fileOverview An AI agent that generates ad copy for various platforms.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

export const GenerateAdCopyInputSchema = z.object({
  product: z.string().describe('The product being advertised.'),
  audience: z.string().describe('The target audience for the ad.'),
  platform: z.string().describe('The platform where the ad will be displayed (e.g., Facebook, Google Ads).'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

export const GenerateAdCopyOutputSchema = z.object({
  headlines: z.array(z.string()).describe('An array of suggested ad headlines.'),
  primary_text: z.string().describe('The main body text of the ad.'),
  descriptions: z.array(z.string()).describe('An array of suggested ad descriptions.'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

const adCopyPrompt = ai.definePrompt({
    name: 'adCopyPrompt',
    input: { schema: GenerateAdCopyInputSchema },
    output: { schema: GenerateAdCopyOutputSchema },
    prompt: `You are a world-class expert in Direct-Response Copywriting.
Generate compelling ad copy variations based on the product, audience, and platform.

**Product:** {{{product}}}
**Audience:** {{{audience}}}
**Platform:** {{{platform}}}

Generate 3-5 variations for headlines and descriptions. The primary text should be engaging and relevant.`
});

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async (input) => {
    const { output } = await adCopyPrompt(input, {
        model: 'googleai/gemini-2.0-flash',
        pluginOptions: input.apiKey ? { googleai: { apiKey: input.apiKey } } : undefined,
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);

export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
    return await generateAdCopyFlow(input);
}
