
'use server';
/**
 * @fileOverview An AI agent that edits text based on instructions.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

const EditTextInputSchema = z.object({
  text: z.string().describe('The original text to be edited.'),
  instruction: z.string().describe('The instruction for how to edit the text (e.g., "summarize", "fix grammar", "make it more punchy").'),
});
export type EditTextInput = z.infer<typeof EditTextInputSchema>;

const EditTextOutputSchema = z.object({
  editedText: z.string().describe('The resulting edited text.'),
});
export type EditTextOutput = z.infer<typeof EditTextOutputSchema>;

export async function editText(input: EditTextInput): Promise<EditTextOutput> {
  return editTextFlow(input);
}

const editTextFlow = ai.defineFlow(
  {
    name: 'editTextFlow',
    inputSchema: EditTextInputSchema,
    outputSchema: EditTextOutputSchema,
  },
  async ({ text, instruction }) => {
    const prompt = `You are an expert copy editor. Your task is to edit the provided text based on the given instruction.

Instruction: ${instruction}

Original Text:
---
${text}
---

Return only the edited text in the 'editedText' field of the JSON output. Do not include any preamble or explanation.`;

    const {output} = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: prompt,
      output: {
          format: 'json',
          schema: EditTextOutputSchema
      },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
