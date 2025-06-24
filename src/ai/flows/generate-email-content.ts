
'use server';

/**
 * @fileOverview An AI agent that generates email subject lines and body copy.
 *
 * - generateEmailContent - A function that handles the email content generation process.
 * - GenerateEmailContentInput - The input type for the generateEmailContent function.
 * - GenerateEmailContentOutput - The return type for the generateEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const GenerateEmailContentInputSchema = z.object({
  objective: z
    .string()
    .describe('The objective of the email, e.g., Promote new product X'),
  tone: z.string().describe('The tone of the email, e.g., enthusiastic'),
  productDetails: z.string().describe('Details about the product or service.'),
  apiKey: z.string().describe('A Google AI API key for authentication.'),
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

const promptTemplate = `You are an expert email copywriter. Generate email subject lines and body copy based on the following information.

Objective: {{{objective}}}
Tone: {{{tone}}}
Product Details: {{{productDetails}}}

Output the response in JSON format.
{
  "subjectLines": ["subject line 1", "subject line 2", ...],
  "body": "email body..."
}
`;

const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: GenerateEmailContentInputSchema,
    outputSchema: GenerateEmailContentOutputSchema,
  },
  async input => {
    const authAi = genkit({
        plugins: [googleAI({ apiKey: input.apiKey })],
        model: 'googleai/gemini-2.0-flash',
    });

    const {output} = await authAi.generate({
        prompt: promptTemplate,
        input: input,
        output: { schema: GenerateEmailContentOutputSchema },
    });

    return output!;
  }
);
