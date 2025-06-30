
'use server';
/**
 * @fileOverview An AI agent that generates a product review.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

export const GenerateProductReviewInputSchema = z.object({
  productName: z.string().describe('The name of the product to review.'),
  features: z
    .string()
    .describe(
      'Key features, benefits, or talking points about the product.'
    ),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateProductReviewInput = z.infer<typeof GenerateProductReviewInputSchema>;


export const GenerateProductReviewOutputSchema = z.object({
  review: z
    .string()
    .describe(
      'The generated product review in Markdown format. It should include an introduction, a list of pros, a list of cons, and a conclusion.'
    ),
});
export type GenerateProductReviewOutput = z.infer<typeof GenerateProductReviewOutputSchema>;


export async function generateProductReview(input: GenerateProductReviewInput): Promise<GenerateProductReviewOutput> {
    return generateProductReviewFlow(input);
}

const generateProductReviewFlow = ai.defineFlow(
  {
    name: 'generateProductReviewFlow',
    inputSchema: GenerateProductReviewInputSchema,
    outputSchema: GenerateProductReviewOutputSchema,
  },
  async ({ productName, features, apiKey }) => {
    const dynamicAI = apiKey ? genkit({ plugins: [googleAI({ apiKey })] }) : ai;

    const prompt = `You are an expert in SEO Copywriting and Affiliate Marketing.
Generate a well-structured and engaging product review in Markdown format.

**Product Name:** ${productName}
**Key Features/Talking Points:** ${features}

**Structure:**
- Catchy introduction
- "Pros" section (bulleted)
- "Cons" section (bulleted)
- Concluding summary

Return ONLY the raw JSON object.`;
    
    const { output } = await dynamicAI.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: GenerateProductReviewOutputSchema,
        },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
