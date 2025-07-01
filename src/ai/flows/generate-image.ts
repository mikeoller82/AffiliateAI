'use server';
/**
 * @fileOverview AI flow for generating an image from a prompt.
 * This has been updated to use the Imagen 4 model and the dedicated
 * `generateImages` API endpoint for more reliable results.
 */
import { GoogleGenAI } from "@google/genai";
import { ImageGenerationBrief, GeneratedImage } from '../types';

export const generateImage = async (brief: ImageGenerationBrief): Promise<GeneratedImage> => {
    const { prompt, style, apiKey } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for image generation.");
    }
    
    // The Imagen model is sophisticated; combining prompt and style often works best.
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;
    const genAI = new GoogleGenAI(apiKey);

    try {
        // --- THIS IS THE NEW, CORRECT PATTERN ---
        // We use the dedicated `generateImages` method and the 'imagen' model.
        const result = await genAI.models.generateImages({
            model: 'imagen-4.0-generate-preview-06-06', // Use the powerful Imagen 4 model
            prompt: fullPrompt,
            config: {
                // Since our function returns one image, we explicitly request one.
                numberOfImages: 1,
            },
        });

        // The response structure is an array of generated images.
        // We must check if the array exists and is not empty.
        if (result.generatedImages && result.generatedImages.length > 0) {
            // Get the first (and only) image we requested.
            const image = result.generatedImages[0];
            const base64Data = image.image.imageBytes;

            // The API returns raw base64 data. We create a data URI for the browser.
            // Imagen models typically produce PNG images.
            const imageDataUri = `data:image/png;base64,${base64Data}`;
            
            return { imageDataUri };
        }
        
        // If the generatedImages array is empty, the prompt was likely blocked.
        throw new Error('No image was generated. The prompt may have been blocked by safety filters or policy violations.');

    } catch (error: any) {
        console.error("Image generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
        // Propagate other errors, including the "blocked prompt" error from our check above.
        throw new Error(error.message || `Failed to communicate with the AI service.`);
    }
};