
'use server';
/**
 * @fileOverview An AI agent that generates marketing hooks for a product.
 *
 * - generateProductHook - A function that handles the hook generation process.
 * - GenerateProductHookInput - The input type for the generateProductHook function.
 * - GenerateProductHookOutput - The return type for the generateProductHook function.
 */

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateProductHookInputSchema = z.object({
  productDescription: z.string().describe('A description of the product.'),
  emotion: z
    .string()
    .describe('The target emotion for the hook, e.g., Urgency, Curiosity, Transformation.'),
  apiKey: z.string().describe('A Google AI API key for authentication.'),
});
export type GenerateProductHookInput = z.infer<typeof GenerateProductHookInputSchema>;

const GenerateProductHookOutputSchema = z.object({
  hooks: z
    .array(z.string())
    .describe('An array of short, punchy marketing hooks.'),
});
export type GenerateProductHookOutput = z.infer<typeof GenerateProductHookOutputSchema>;

export async function generateProductHook(
  input: GenerateProductHookInput
): Promise<GenerateProductHookOutput> {
  return generateProductHookFlow(input);
}

const promptTemplate = `You are a master copywriter specializing in creating viral marketing hooks for social media, landing pages, and ads.

  Generate 3-5 short, punchy hook ideas for the following product.

  Product Description: {{{productDescription}}}
  Target Emotion: {{{emotion}}}

  The hooks should be designed to grab attention and evoke the specified emotion.
  `;

const generateProductHookFlow = ai.defineFlow(
  {
    name: 'generateProductHookFlow',
    inputSchema: GenerateProductHookInputSchema,
    outputSchema: GenerateProductHookOutputSchema,
  },
  async input => {
    const authAi = genkit({
      plugins: [googleAI({ apiKey: input.apiKey })],
      model: 'googleai/gemini-2.0-flash',
    });

    const {output} = await authAi.generate({
        prompt: promptTemplate,
        input: input,
        output: { schema: GenerateProductHookOutputSchema },
    });
    return output!;
  }
);
