
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/core';
import { geminiPro } from '@genkit-ai/googleai';
import * as prompts from '../prompts';
import { Flow } from '@genkit-ai/core/lib/flow';

export const SuggestCTAsInputSchema = z.object({
  context: z.string().describe('The context of the landing page or ad, e.g., "Landing page for a free webinar on real estate".'),
});

export const SuggestCTAsOutputSchema = z.array(z.string()).describe('A list of suggested CTAs.');

let suggestCTAsFlow: Flow<typeof SuggestCTAsInputSchema, typeof SuggestCTAsOutputSchema, any>;

export function getSuggestCTAsFlow() {
  if (!suggestCTAsFlow) {
    suggestCTAsFlow = defineFlow(
      {
        name: 'suggestCTAsFlow',
        inputSchema: SuggestCTAsInputSchema,
        outputSchema: SuggestCTAsOutputSchema,
      },
      async ({ context }) => {
        const prompt = prompts.suggestCTAs(context);
        
        const llmResponse = await geminiPro.generate({
            prompt: prompt,
            output: {
                format: 'json',
                schema: SuggestCTAsOutputSchema,
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
  return suggestCTAsFlow;
}
