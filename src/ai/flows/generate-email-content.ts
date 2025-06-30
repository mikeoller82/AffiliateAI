
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/core';
import { geminiPro } from '@genkit-ai/googleai';
import * as prompts from '../prompts';
import { Flow } from '@genkit-ai/core/lib/flow';

export const GenerateEmailContentInputSchema = z.object({
  objective: z
    .string()
    .describe('The objective of the email, e.g., Promote new product X'),
  tone: z.string().describe('The tone of the email, e.g., enthusiastic'),
  productDetails: z.string().describe('Details about the product or service.'),
});

export const GenerateEmailContentOutputSchema = z.object({
  subjectLines: z.array(z.string()).describe('Generated subject lines.'),
  body: z.string().describe('Generated email body.'),
});

let generateEmailContentFlow: Flow<typeof GenerateEmailContentInputSchema, typeof GenerateEmailContentOutputSchema, any>;

export function getGenerateEmailContentFlow() {
  if (!generateEmailContentFlow) {
    generateEmailContentFlow = defineFlow(
      {
        name: 'generateEmailContentFlow',
        inputSchema: GenerateEmailContentInputSchema,
        outputSchema: GenerateEmailContentOutputSchema,
      },
      async ({ objective, tone, productDetails }) => {
        const prompt = prompts.generateEmailContent(objective, tone, productDetails);
        
        const llmResponse = await geminiPro.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: GenerateEmailContentOutputSchema,
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
  return generateEmailContentFlow;
}
