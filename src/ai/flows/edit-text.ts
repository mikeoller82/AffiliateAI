
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const editTextFlow = genkit.defineFlow(
  {
    name: 'editTextFlow',
    inputSchema: z.object({
      text: z.string(),
      instruction: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ text, instruction }) => {
    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Edit the following text based on the instruction.
        Text: ${text}
        Instruction: ${instruction}`,
    });

    return llmResponse.text();
  }
);
