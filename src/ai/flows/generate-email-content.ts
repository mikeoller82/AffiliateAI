
'use server';

/**
 * @fileOverview An AI agent that generates email subject lines and body copy.
 *
 * - generateEmailContent - A function that handles the email content generation process.
 * - GenerateEmailContentInput - The input type for the generateEmailContent function.
 * - GenerateEmailContentOutput - The return type for the generateEmailContent function.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';


const GenerateEmailContentInputSchema = z.object({
  objective: z
    .string()
    .describe('The objective of the email, e.g., Promote new product X'),
  tone: z.string().describe('The tone of the email, e.g., enthusiastic'),
  productDetails: z.string().describe('Details about the product or service.'),
});
export type GenerateEmailContentInput = z.infer<typeof GenerateEmailContentInputSchema>;

const GenerateEmailContentOutputSchema = z.object({
  subjectLines: z.array(z.string()).describe('Generated subject lines.'),
  body: z.string().describe('Generated email body.'),
});
export type GenerateEmailContentOutput = z.infer<typeof GenerateEmailContentOutputSchema>;

export async function generateEmailContent(
  input: GenerateEmailContentInput
): Promise<GenerateEmailContentOutput> {
  return generateEmailContentFlow(input);
}


const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: GenerateEmailContentInputSchema,
    outputSchema: GenerateEmailContentOutputSchema,
  },
  async ({ objective, tone, productDetails }) => {
    const prompt = `You are an expert email copywriter. Generate email subject lines and body copy based on the following information.

      Objective: ${objective}
      Tone: ${tone}
      Product Details: ${productDetails}

      Output the response in JSON format.
      {
        "subjectLines": ["subject line 1", "subject line 2", ...],
        "body": "email body..."
      }
      `;

    const {output} = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: GenerateEmailContentOutputSchema
        },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
