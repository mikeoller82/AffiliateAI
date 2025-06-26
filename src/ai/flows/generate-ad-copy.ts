
'use server';

/**
 * @fileOverview An AI agent responsible for generating compelling ad copy.
 *
 * - generateAdCopy - A function that generates ad copy.
 * - GenerateAdCopyInput - The input type for the generateAdCopy function.
 * - GenerateAdCopyOutput - The return type for the generateAdCopy function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';


const GenerateAdCopyInputSchema = z.object({
  product: z.string().describe('The product being advertised.'),
  audience: z.string().describe('The target audience for the ad.'),
  platform: z.string().describe('The platform where the ad will be displayed (e.g., Facebook, Google Ads).'),
});

export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

const GenerateAdCopyOutputSchema = z.object({
  headlines: z.array(z.string()).describe('An array of suggested ad headlines.'),
  primary_text: z.string().describe('The main body text of the ad.'),
  descriptions: z.array(z.string()).describe('An array of suggested ad descriptions.'),
});

export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;

export async function generateAdCopy(input: GenerateAdCopyInput): Promise<GenerateAdCopyOutput> {
  return generateAdCopyFlow(input);
}

const generateAdCopyFlow = ai.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: GenerateAdCopyInputSchema,
    outputSchema: GenerateAdCopyOutputSchema,
  },
  async ({ product, audience, platform }) => {
    const prompt = `You are an expert direct-response copywriter specializing in digital advertising.

      Based on the product, audience, and platform, generate compelling ad copy variations.

      Product: ${product}
      Audience: ${audience}
      Platform: ${platform}

      Generate 3-5 variations for headlines and descriptions.
      Ensure the primary text is engaging and relevant to the target audience.
      The copy should be suitable for the specified platform.

      Output JSON: {
        "headlines": ["headline 1", "headline 2", ...],
        "primary_text": "Main ad copy text.",
        "descriptions": ["description 1", "description 2", ...]
      }`;


    const {output} = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: GenerateAdCopyOutputSchema 
        },
    });
    
    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
