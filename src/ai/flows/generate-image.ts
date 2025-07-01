
'use server';
/**
 * @fileOverview AI flow for generating an image from a prompt.
 * This has been updated to use the correct model and parameters for image generation.
 */
import { GoogleGenerativeAI } from "@google/genai";
import { ImageGenerationBrief, GeneratedImage } from '../types';

export const generateImage = async (brief: ImageGenerationBrief): Promise<GeneratedImage> => {
    const { prompt, style, apiKey } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for image generation.");
    }
    
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // NOTE: This uses a multimodal model capable of generating images.
        // The previous error was due to incorrect SDK usage, not the model itself.
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest",
        });

        // This is a simplified approach for direct image generation.
        // A more complex flow might involve checking for text content as well.
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        // Find the part of the response that contains image data.
        // This part of the logic was likely correct, but the call to get here was failing.
        const imageParts = response.candidates?.[0]?.content?.parts?.filter(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));

        if (imageParts && imageParts.length > 0 && imageParts[0].inlineData) {
            const { mimeType, data } = imageParts[0].inlineData;
            const imageDataUri = `data:${mimeType};base64,${data}`;
            return { imageDataUri };
        }
        
        // If no image is found, check for a text response which might contain an error or explanation.
        const textResponse = response.text();
        if (textResponse) {
             throw new Error(`Image generation failed. The model responded with text: ${textResponse}`);
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
