
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateImageFlow = genkit.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: z.object({
      prompt: z.string(),
      style: z.string().optional(),
    }),
    outputSchema: z.string(),
  },
  async ({ prompt, style }) => {
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;

    const llmResponse = await genkit.generate({
      model: googleAI.model('imagen-3.0-generate-002'),
      prompt: fullPrompt,
      output: { format: 'media' },
    });

    const imagePart = llmResponse.output();
    if (!imagePart?.media?.url) {
      throw new Error('No image was generated.');
    }

    return imagePart.media.url;
  }
);
