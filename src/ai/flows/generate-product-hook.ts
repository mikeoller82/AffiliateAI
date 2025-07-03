
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateProductHookFlow = genkit.defineFlow(
  {
    name: 'generateProductHookFlow',
    inputSchema: z.object({
      productDescription: z.string(),
      emotion: z.string(),
    }),
    outputSchema: z.object({
      hooks: z.array(z.string()),
    }),
  },
  async ({ productDescription, emotion }) => {
    const prompt = `
    You are an expert in Viral Marketing.
    Your task is to generate 3-5 short, punchy marketing hook ideas designed to grab attention and evoke a specific emotion.

    **Product Description:** ${productDescription}
    **Target Emotion:** ${emotion}

    **Instructions:**
    - Generate hooks that are concise and memorable.
    - Each hook should strongly resonate with the target emotion.
    - The hooks should be directly related to the product.

    Output structured data that adheres to the provided JSON schema.
  `;

    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt,
      output: {
        schema: z.object({
          hooks: z.array(z.string()),
        }),
      },
    });

    return llmResponse.output();
  }
);
