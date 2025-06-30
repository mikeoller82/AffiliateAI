
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/core';
import { imagen2 } from '@genkit-ai/googleai';
import { Flow } from '@genkit-ai/core/lib/flow';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('A detailed text description of the image to generate.'),
  style: z.string().optional().describe('The artistic style of the image.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageDataUri: z.string().describe('The generated image as a data URI.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

// Use a variable to hold the memoized flow
let generateImageFlow: Flow<typeof GenerateImageInputSchema, typeof GenerateImageOutputSchema, any>;

// Export a function to get the flow, defining it only once.
export function getGenerateImageFlow() {
  if (!generateImageFlow) {
    generateImageFlow = defineFlow(
      {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
      },
      async ({ prompt, style }) => {
        const generationResponse = await imagen2.generate({
          prompt: `${prompt}, in the style of ${style}`,
          width: 1024,
          height: 576,
        });

        const generatedImage = generationResponse.media[0];
        if (!generatedImage) {
          throw new Error('Image generation failed. The prompt may have been blocked.');
        }

        return {
          imageDataUri: generatedImage.toDataUri(),
        };
      }
    );
  }
  return generateImageFlow;
}
