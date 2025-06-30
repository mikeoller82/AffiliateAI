
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/core';
import { geminiPro } from '@genkit-ai/googleai';
import * as prompts from '../prompts';
import { Flow } from '@genkit-ai/core/lib/flow';

export const GenerateProductReviewInputSchema = z.object({
  productName: z.string().describe('The name of the product to review.'),
  features: z
    .string()
    .describe(
      'Key features, benefits, or talking points about the product.'
    ),
});

export const GenerateProductReviewOutputSchema = z.object({
  review: z
    .string()
    .describe(
      'The generated product review in Markdown format. It should include an introduction, a list of pros, a list of cons, and a conclusion.'
    ),
});

let generateProductReviewFlow: Flow<typeof GenerateProductReviewInputSchema, typeof GenerateProductReviewOutputSchema, any>;

export function getGenerateProductReviewFlow() {
  if (!generateProductReviewFlow) {
    generateProductReviewFlow = defineFlow(
      {
        name: 'generateProductReviewFlow',
        inputSchema: GenerateProductReviewInputSchema,
        outputSchema: GenerateProductReviewOutputSchema,
      },
      async ({ productName, features }) => {
        const prompt = prompts.generateProductReview(productName, features);
        
        const llmResponse = await geminiPro.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: GenerateProductReviewOutputSchema,
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
  return generateProductReviewFlow;
}
