
'use server';

/**
 * @fileOverview An AI agent that generates a product review.
 *
 * - generateProductReview - A function that handles the product review generation process.
 * - GenerateProductReviewInput - The input type for the generateProductReview function.
 * - GenerateProductReviewOutput - The return type for the generateProductReview function.
 */

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateProductReviewInputSchema = z.object({
  productName: z.string().describe('The name of the product to review.'),
  features: z
    .string()
    .describe(
      'Key features, benefits, or talking points about the product.'
    ),
  apiKey: z.string().describe('A Google AI API key for authentication.'),
});
export type GenerateProductReviewInput = z.infer<typeof GenerateProductReviewInputSchema>;

const GenerateProductReviewOutputSchema = z.object({
  review: z
    .string()
    .describe(
      'The generated product review in Markdown format. It should include an introduction, a list of pros, a list of cons, and a conclusion.'
    ),
});
export type GenerateProductReviewOutput = z.infer<typeof GenerateProductReviewOutputSchema>;

export async function generateProductReview(
  input: GenerateProductReviewInput
): Promise<GenerateProductReviewOutput> {
  return generateProductReviewFlow(input);
}

const promptTemplate = `You are an expert SEO copywriter and affiliate marketer specializing in writing compelling product reviews.

  Generate a product review for the following product. The review should be well-structured, engaging, and optimized for search engines.

  Product Name: {{{productName}}}
  Key Features/Talking Points: {{{features}}}

  Structure the review in Markdown format as follows:
  - A catchy introduction that hooks the reader.
  - A "Pros" section with a bulleted list.
  - A "Cons" section with a bulleted list.
  - A concluding summary that helps the reader make a decision.
  `;

const generateProductReviewFlow = ai.defineFlow(
  {
    name: 'generateProductReviewFlow',
    inputSchema: GenerateProductReviewInputSchema,
    outputSchema: GenerateProductReviewOutputSchema,
  },
  async input => {
    const authAi = genkit({
      plugins: [googleAI({ apiKey: input.apiKey })],
      model: 'googleai/gemini-2.0-flash',
    });

    const {output} = await authAi.generate({
        prompt: promptTemplate,
        input: input,
        output: { schema: GenerateProductReviewOutputSchema },
    });
    return output!;
  }
);
