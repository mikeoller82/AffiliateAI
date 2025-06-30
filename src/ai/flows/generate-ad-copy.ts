
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/core';
import { geminiPro } from '@genkit-ai/googleai';
import * as prompts from '../prompts';
import { Flow } from '@genkit-ai/core/lib/flow';

export const GenerateAdCopyInputSchema = z.object({
  product: z.string().describe('The product being advertised.'),
  audience: z.string().describe('The target audience for the ad.'),
  platform: z.string().describe('The platform where the ad will be displayed (e.g., Facebook, Google Ads).'),
});

export const GenerateAdCopyOutputSchema = z.object({
  headlines: z.array(z.string()).describe('An array of suggested ad headlines.'),
  primary_text: z.string().describe('The main body text of the ad.'),
  descriptions: z.array(z.string()).describe('An array of suggested ad descriptions.'),
});

let generateAdCopyFlow: Flow<typeof GenerateAdCopyInputSchema, typeof GenerateAdCopyOutputSchema, any>;

export function getGenerateAdCopyFlow() {
  if (!generateAdCopyFlow) {
    generateAdCopyFlow = defineFlow(
      {
        name: 'generateAdCopyFlow',
        inputSchema: GenerateAdCopyInputSchema,
        outputSchema: GenerateAdCopyOutputSchema,
      },
      async ({ product, audience, platform }) => {
        const prompt = prompts.generateAdCopy(product, audience, platform);
        
        const llmResponse = await geminiPro.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: GenerateAdCopyOutputSchema,
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
  return generateAdCopyFlow;
}
