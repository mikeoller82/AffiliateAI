
'use server';
/**
 * @fileOverview AI flow for generating an image from a prompt.
 * This has been updated to use the correct model and parameters for image generation.
 */
import { GoogleGenAI } from "@google/genai";
import { ImageGenerationBrief, GeneratedImage } from '../types';

export const generateImage = async (brief: ImageGenerationBrief): Promise<GeneratedImage> => {
    const { prompt, style, apiKey } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for image generation.");
    }
    
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;
    const ai = new GoogleGenAI(apiKey);

    try {
        // NOTE: The previous version used a text model. This is the likely source of the error.
        // Switching to a stable, multimodal model is the correct approach.
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
        });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        // Find the part of the response that contains image data
        const imageParts = response.parts?.filter(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));

        if (imageParts && imageParts.length > 0 && imageParts[0].inlineData) {
            const { mimeType, data } = imageParts[0].inlineData;
            const imageDataUri = `data:${mimeType};base64,${data}`;
            return { imageDataUri };
        }
        
        // If no image is found, check for a text response which might contain an error or explanation.
        const textResponse = response.text();
        if (textResponse) {
             throw new Error(`Image generation failed: ${textResponse}`);
        }

        throw new Error('No image was generated. The prompt may have been blocked by safety filters.');

    } catch (error: any) {
        console.error("Image generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
        // Propagate other errors
        throw new Error(error.message || `Failed to communicate with the AI service.`);
    }
};
