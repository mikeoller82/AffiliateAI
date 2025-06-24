'use server';
/**
 * @fileOverview An AI agent that generates images from a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the image to generate.'),
  aspectRatio: z.enum(['1:1', '16:9', '9:16']).describe('The desired aspect ratio for the generated image.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `(Aspect Ratio: ${input.aspectRatio}) ${input.prompt}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media) {
      throw new Error('No image was generated. The prompt may have been blocked by safety filters.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
