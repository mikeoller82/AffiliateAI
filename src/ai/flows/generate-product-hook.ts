
'use server';
/**
 * @fileOverview An AI agent that generates marketing hooks for a product.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

export const GenerateProductHookInputSchema = z.object({
  productDescription: z.string().describe('A description of the product.'),
  emotion: z
    .string()
    .describe('The target emotion for the hook, e.g., Urgency, Curiosity, Transformation.'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateProductHookInput = z.infer<typeof GenerateProductHookInputSchema>;


export const GenerateProductHookOutputSchema = z.object({
  hooks: z
    .array(z.string())
    .describe('An array of short, punchy marketing hooks.'),
});
export type GenerateProductHookOutput = z.infer<typeof GenerateProductHookOutputSchema>;


export async function generateProductHook(input: GenerateProductHookInput): Promise<GenerateProductHookOutput> {
    return generateProductHookFlow(input);
}

const generateProductHookFlow = ai.defineFlow(
  {
    name: 'generateProductHookFlow',
    inputSchema: GenerateProductHookInputSchema,
    outputSchema: GenerateProductHookOutputSchema,
  },
  async ({ productDescription, emotion, apiKey }) => {
    const dynamicAI = apiKey ? genkit({ plugins: [googleAI({ apiKey })] }) : ai;

    const prompt = `You are an expert in Viral Marketing.
Generate 3-5 short, punchy marketing hook ideas designed to grab attention and evoke a specific emotion.

**Product Description:** ${productDescription}
**Target Emotion:** ${emotion}

Return ONLY the raw JSON object.`;
    
    const { output } = await dynamicAI.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: GenerateProductHookOutputSchema,
        },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
