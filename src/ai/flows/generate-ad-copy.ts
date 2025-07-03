
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateAdCopyFlow = genkit.defineFlow(
  {
    name: 'generateAdCopyFlow',
    inputSchema: z.object({
      product: z.string(),
      audience: z.string(),
      platform: z.string(),
    }),
    outputSchema: z.object({
      headlines: z.array(z.string()),
      primaryText: z.string(),
      descriptions: z.array(z.string()),
    }),
  },
  async ({ product, audience, platform }) => {
    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Generate ad copy for a ${product} targeting ${audience} on ${platform}.`,
      output: {
        schema: z.object({
          headlines: z.array(z.string()),
          primaryText: z.string(),
          descriptions: z.array(z.string()),
        }),
      },
    });

    return llmResponse.output();
  }
);
