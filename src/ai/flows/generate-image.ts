
'use server';
/**
 * @fileOverview An AI agent that generates images from a text prompt.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the image to generate.'),
  style: z.string().optional().describe('The artistic style of the image.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
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
  async ({ prompt, style }) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `${prompt}${style ? `, in the style of ${style}` : ''}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        // You can add other configurations like width/height here if needed.
        // For example:
        // width: 1024,
        // height: 576,
      },
    });

    const generatedImage = media[0];
    if (!generatedImage || !generatedImage.url) {
      throw new Error('Image generation failed. The prompt may have been blocked or the model returned no image.');
    }

    return {
      imageDataUri: generatedImage.url,
    };
  }
);
