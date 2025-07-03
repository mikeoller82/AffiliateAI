
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const suggestCtasFlow = genkit.defineFlow(
  {
    name: 'suggestCtasFlow',
    inputSchema: z.object({
      context: z.string(),
    }),
    outputSchema: z.object({
      ctas: z.array(z.string()),
    }),
  },
  async ({ context }) => {
    const prompt = `
    You are a world-class expert in Marketing Strategy and Conversion Rate Optimization.
    Your task is to suggest 3-5 compelling Call-To-Action (CTA) phrases for the given context.

    **Context:** ${context}

    **Instructions:**
    - The CTAs should be short, punchy, and action-oriented.
    - Tailor the CTAs to be highly relevant to the provided context.
    - Focus on creating a sense of urgency or clear benefit for the user.
    
    Output structured data that adheres to the provided JSON schema.
  `;

    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt,
      output: {
        schema: z.object({
          ctas: z.array(z.string()),
        }),
      },
    });

    return llmResponse.output();
  }
);
