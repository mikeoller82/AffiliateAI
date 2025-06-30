'use server';
/**
 * @fileOverview An AI agent that generates images from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { z } from 'genkit';
import { ai } from '@/ai/genkit';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the image to generate.'),
  style: z.string().optional().describe('The artistic style of the image (e.g., photorealistic, anime).'),
  apiKey: z.string().optional().describe('User-provided Google AI API Key.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { prompt, style, apiKey } = input;
    
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: fullPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
      pluginOptions: apiKey ? { googleai: { apiKey } } : undefined,
    });
    
    if (!media) {
      throw new Error('No image was generated. The prompt may have been blocked by safety filters.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return await generateImageFlow(input);
}
