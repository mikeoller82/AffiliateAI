// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview An AI agent that generates email subject lines and body copy.
 *
 * - generateEmailContent - A function that handles the email content generation process.
 * - GenerateEmailContentInput - The input type for the generateEmailContent function.
 * - GenerateEmailContentOutput - The return type for the generateEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const prompt = ai.definePrompt({
  name: 'generateEmailContentPrompt',
  input: {schema: GenerateEmailContentInputSchema},
  output: {schema: GenerateEmailContentOutputSchema},
  prompt: `You are an expert email copywriter. Generate email subject lines and body copy based on the following information.

Objective: {{{objective}}}
Tone: {{{tone}}}
Product Details: {{{productDetails}}}

Output the response in JSON format.
{
  "subject_lines": ["subject line 1", "subject line 2", ...],
  "body": "email body..."
}
`,
});

const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: GenerateEmailContentInputSchema,
    outputSchema: GenerateEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
