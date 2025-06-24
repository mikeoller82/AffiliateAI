
'use server';
/**
 * @fileOverview An AI agent that edits text based on instructions.
 *
 * - editText - A function that handles the text editing process.
 * - EditTextInput - The input type for the editText function.
 * - EditTextOutput - The return type for the editText function.
 */

import {ai} from '@/ai/genkit';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

const EditTextInputSchema = z.object({
  text: z.string().describe('The original text to be edited.'),
  instruction: z.string().describe('The instruction for how to edit the text (e.g., "summarize", "fix grammar", "make it more punchy").'),
  apiKey: z.string().describe('A Google AI API key for authentication.'),
});
export type EditTextInput = z.infer<typeof EditTextInputSchema>;

const EditTextOutputSchema = z.object({
  editedText: z.string().describe('The resulting edited text.'),
});
export type EditTextOutput = z.infer<typeof EditTextOutputSchema>;

export async function editText(input: EditTextInput): Promise<EditTextOutput> {
  return editTextFlow(input);
}

const promptTemplate = `You are an expert copy editor. Your task is to edit the provided text based on the given instruction.

Instruction: {{{instruction}}}

Original Text:
---
{{{text}}}
---

Return only the edited text in the 'editedText' field of the JSON output. Do not include any preamble or explanation.`;

const editTextFlow = ai.defineFlow(
  {
    name: 'editTextFlow',
    inputSchema: EditTextInputSchema,
    outputSchema: EditTextOutputSchema,
  },
  async (input) => {
    const authAi = genkit({
      plugins: [googleAI({ apiKey: input.apiKey })],
      model: 'googleai/gemini-2.0-flash',
    });

    const {output} = await authAi.generate({
      prompt: promptTemplate,
      input: input,
      output: { schema: EditTextOutputSchema },
    });
    return output!;
  }
);
