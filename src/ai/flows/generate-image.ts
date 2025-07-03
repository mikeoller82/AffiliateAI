
'use server';
/**
 * @fileOverview AI flow for generating an image from a prompt.
 * This file has been corrected to use the standard Google AI SDK pattern for image generation.
 */
import * as genAI from "@google/genai";
import { ImageGenerationBrief, GeneratedImage } from '../types';

export const generateImage = async (brief: ImageGenerationBrief): Promise<GeneratedImage> => {
    const { prompt, style, apiKey } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for image generation.");
    }
    
    const fullPrompt = `${prompt}, in the style of ${style || 'photorealism'}`;
    const genAIApi = new genAI.GoogleGenerativeAI(apiKey);
    const model = genAIApi.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); 

    try {
        const result = await model.generateContent(fullPrompt);
        const response = result.response;

        const imageParts = response.candidates?.[0]?.content?.parts?.filter(
            (part) => !!part.inlineData
        );

        if (imageParts && imageParts.length > 0 && imageParts[0].inlineData) {
            const { mimeType, data } = imageParts[0].inlineData;
            const imageDataUri = `data:${mimeType};base64,${data}`;
            return { imageDataUri };
        }
        
        throw new Error('No image was generated. The model may not have produced an image for this prompt.');

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
