
'use server';
/**
 * @fileOverview AI flow for generating an image from a prompt.
 * This file has been corrected to use the Genkit library pattern for image generation.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import type { ImageGenerationBrief, GeneratedImage } from '../types';

export const generateImage = async (brief: ImageGenerationBrief): Promise<GeneratedImage> => {
    const { prompt, style, apiKey } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for image generation.");
    }
    
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;
    
    const userAi = genkit({
        plugins: [googleAI({ apiKey })],
    });

    try {
        const { media } = await userAi.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: fullPrompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        if (!media?.url) {
            throw new Error('No image was generated. The model may not have produced an image for this prompt.');
        }

        return { imageDataUri: media.url };

    } catch (error: any) {
        console.error("Image generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
        if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error(error.message || `Failed to communicate with the AI service.`);
    }
};
