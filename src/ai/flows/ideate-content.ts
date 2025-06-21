'use server';

/**
 * @fileOverview A content ideation AI agent.
 *
 * - ideateContent - A function that handles the content ideation process.
 * - IdeateContentInput - The input type for the ideateContent function.
 * - IdeateContentOutput - The return type for the ideateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeateContentInputSchema = z.object({
  niche: z.string().describe('The content niche, e.g., sustainable gardening.'),
  format: z.string().describe('The content format, e.g., blog_post.'),
});
export type IdeateContentInput = z.infer<typeof IdeateContentInputSchema>;

const IdeateContentOutputSchema = z.object({
  ideas: z
    .array(z.string())
    .describe('A list of compelling content ideas (titles and brief outlines).'),
});
export type IdeateContentOutput = z.infer<typeof IdeateContentOutputSchema>;

export async function ideateContent(input: IdeateContentInput): Promise<IdeateContentOutput> {
  return ideateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ideateContentPrompt',
  input: {schema: IdeateContentInputSchema},
  output: {schema: IdeateContentOutputSchema},
  prompt: `You are a content strategist specializing in generating content ideas.

  Generate a list of compelling content ideas (titles and brief outlines) for the given niche and format.

  Niche: {{{niche}}}
  Format: {{{format}}}
  `,
});

const ideateContentFlow = ai.defineFlow(
  {
    name: 'ideateContentFlow',
    inputSchema: IdeateContentInputSchema,
    outputSchema: IdeateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
