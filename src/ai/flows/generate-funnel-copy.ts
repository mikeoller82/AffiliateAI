
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateFunnelCopyFlow = ai.defineFlow(
  {
    name: 'generateFunnelCopyFlow',
    inputSchema: z.object({
      productDescription: z.string(),
      copyType: z.string(),
      userPrompt: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ productDescription, copyType, userPrompt }) => {
    const prompt = `
    You are an expert conversion copywriter designing a landing page funnel.

    The product is: ${productDescription}

    Your task is to generate a "${copyType}".

    Follow this instruction from the user: ${userPrompt}

    Output only the generated copy.
  `;

    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt,
    });

    return llmResponse.text();
  }
);
