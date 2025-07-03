
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ai } from 'node_modules/@genkit-ai/core/lib/action-B0Us3bBw';

export const generateProductReviewFlow = ai.defineFlow(
  {
    name: 'generateProductReviewFlow',
    inputSchema: z.object({
      productName: z.string(),
      features: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ productName, features }) => {
    const prompt = `
    You are an expert in SEO Copywriting and Affiliate Marketing.
    Your task is to generate a well-structured and engaging product review in Markdown format.

    **Product Name:** ${productName}
    **Key Features/Talking Points:** ${features}

    **Instructions:**
    - Create a catchy introduction to grab the reader's attention.
    - Write a "Pros" section with bullet points highlighting the product's strengths.
    - Write a "Cons" section with bullet points for a balanced perspective.
    - Provide a concluding summary that helps the reader make a decision.
    - The entire output should be a single string in Markdown format.

    Output only the generated review.
  `;

    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt,
    });

    return llmResponse.text();
  }
);
