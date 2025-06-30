'use server';
/**
 * @fileOverview An AI agent that edits text based on instructions.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';

export const EditTextInputSchema = z.object({
  text: z.string().min(1).describe('The original text to be edited.'),
  instruction: z.string().min(1).describe('The instruction for how to edit the text (e.g., "summarize", "fix grammar", "make it more punchy").'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type EditTextInput = z.infer<typeof EditTextInputSchema>;

export const EditTextOutputSchema = z.object({
  editedText: z.string().describe('The resulting edited text.'),
});
export type EditTextOutput = z.infer<typeof EditTextOutputSchema>;


const editTextPrompt = ai.definePrompt(
    {
        name: 'editTextPrompt',
        input: { schema: EditTextInputSchema },
        output: { schema: EditTextOutputSchema },
        prompt: `You are an expert copy editor. Your task is to edit the provided text based on the given instruction.

Instruction: {{{instruction}}}

Original Text:
---
{{{text}}}
---

Please edit the text according to the instruction.`,
    }
);

const editTextFlow = ai.defineFlow(
    {
        name: 'editTextFlow',
        inputSchema: EditTextInputSchema,
        outputSchema: EditTextOutputSchema,
    },
    async (input) => {
        const { output } = await editTextPrompt(input, {
            model: 'googleai/gemini-2.0-flash',
            pluginOptions: input.apiKey ? { googleai: { apiKey: input.apiKey } } : undefined,
             config: {
                temperature: 0.5,
             },
        });

        if (!output) {
            throw new Error('AI failed to generate a response for text editing.');
        }
        return output;
    }
);

export async function editText(input: EditTextInput): Promise<EditTextOutput> {
  return await editTextFlow(input);
}
