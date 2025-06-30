
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/core';
import { geminiPro } from '@genkit-ai/googleai';
import * as prompts from '../prompts';
import { Flow } from '@genkit-ai/core/lib/flow';

export const GenerateProductHookInputSchema = z.object({
  productDescription: z.string().describe('A description of the product.'),
  emotion: z
    .string()
    .describe('The target emotion for the hook, e.g., Urgency, Curiosity, Transformation.'),
});

export const GenerateProductHookOutputSchema = z.object({
  hooks: z
    .array(z.string())
    .describe('An array of short, punchy marketing hooks.'),
});

let generateProductHookFlow: Flow<typeof GenerateProductHookInputSchema, typeof GenerateProductHookOutputSchema, any>;

export function getGenerateProductHookFlow() {
  if (!generateProductHookFlow) {
    generateProductHookFlow = defineFlow(
      {
        name: 'generateProductHookFlow',
        inputSchema: GenerateProductHookInputSchema,
        outputSchema: GenerateProductHookOutputSchema,
      },
      async ({ productDescription, emotion }) => {
        const prompt = prompts.generateProductHook(productDescription, emotion);
        
        const llmResponse = await geminiPro.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: GenerateProductHookOutputSchema,
            },
        });

        const output = llmResponse.output();
        if (!output) {
          throw new Error("AI failed to generate a response.");
        }
        return output;
      }
    );
  }
  return generateProductHookFlow;
}
