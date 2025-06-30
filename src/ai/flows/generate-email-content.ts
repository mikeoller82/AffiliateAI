
'use server';
/**
 * @fileOverview An AI agent that generates email content.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

export const GenerateEmailContentInputSchema = z.object({
  objective: z
    .string()
    .describe('The objective of the email, e.g., Promote new product X'),
  tone: z.string().describe('The tone of the email, e.g., enthusiastic'),
  productDetails: z.string().describe('Details about the product or service.'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateEmailContentInput = z.infer<typeof GenerateEmailContentInputSchema>;


export const GenerateEmailContentOutputSchema = z.object({
  subjectLines: z.array(z.string()).describe('Generated subject lines.'),
  body: z.string().describe('Generated email body.'),
});
export type GenerateEmailContentOutput = z.infer<typeof GenerateEmailContentOutputSchema>;

export async function generateEmailContent(input: GenerateEmailContentInput): Promise<GenerateEmailContentOutput> {
    return generateEmailContentFlow(input);
}

const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: GenerateEmailContentInputSchema,
    outputSchema: GenerateEmailContentOutputSchema,
  },
  async ({ objective, tone, productDetails, apiKey }) => {
    const dynamicAI = apiKey ? genkit({ plugins: [googleAI({ apiKey })] }) : ai;
    
    const prompt = `You are a world-class expert in Email Copywriting.
Generate email subject lines and body copy based on the provided information.

**Objective:** ${objective}
**Tone:** ${tone}
**Product Details:** ${productDetails}

Return ONLY the raw JSON object with the keys "subjectLines" and "body".`;
        
    const { output } = await dynamicAI.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: prompt,
        output: {
            format: 'json',
            schema: GenerateEmailContentOutputSchema,
        },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
