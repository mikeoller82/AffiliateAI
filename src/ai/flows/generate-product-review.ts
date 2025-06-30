'use server';
/**
 * @fileOverview An AI agent that generates a product review.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';

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


const productReviewPrompt = ai.definePrompt({
    name: 'productReviewPrompt',
    input: { schema: GenerateProductReviewInputSchema },
    output: { schema: GenerateProductReviewOutputSchema },
    prompt: `You are an expert in SEO Copywriting and Affiliate Marketing.
Generate a well-structured and engaging product review in Markdown format.

**Product Name:** {{{productName}}}
**Key Features/Talking Points:** {{{features}}}

**Structure:**
- Catchy introduction
- "Pros" section (bulleted)
- "Cons" section (bulleted)
- Concluding summary`
});


const generateProductReviewFlow = ai.defineFlow(
  {
    name: 'generateProductReviewFlow',
    inputSchema: GenerateProductReviewInputSchema,
    outputSchema: GenerateProductReviewOutputSchema,
  },
  async (input) => {
    const { output } = await productReviewPrompt(input, {
        model: 'googleai/gemini-2.0-flash',
        pluginOptions: input.apiKey ? { googleai: { apiKey: input.apiKey } } : undefined,
    });
    
    if (!output) {
      throw new Error("AI failed to generate product review.");
    }
    return output;
  }
);


export async function generateProductReview(input: GenerateProductReviewInput): Promise<GenerateProductReviewOutput> {
    return await generateProductReviewFlow(input);
}
