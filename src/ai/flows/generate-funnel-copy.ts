
'use server';
/**
 * @fileOverview AI flow for generating copy for a landing page funnel.
 * This file has been corrected to use the standard Google AI SDK pattern.
 */
import * as genAI from "@google/genai";
import { FunnelCopyBrief, GeneratedFunnelCopy } from '../types';

const constructPrompt = (brief: Omit<FunnelCopyBrief, 'apiKey'>): string => {
  return `
    You are an expert conversion copywriter designing a landing page funnel.

    The product is: ${brief.productDescription}

    Your task is to generate a "${brief.copyType}".

    Follow this instruction from the user: ${brief.userPrompt}

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks.
    The JSON object must have a single key: "generatedCopy", which should be a string containing the generated copy.

    Example JSON output:
    {
      "generatedCopy": "This is the generated headline or text."
    }
  `;
};

export const generateFunnelCopy = async (brief: FunnelCopyBrief): Promise<GeneratedFunnelCopy> => {
    const { apiKey, ...promptBrief } = brief;

    if (!apiKey) {
        throw new Error("API key is required for funnel copy generation.");
    }
    
    const genAIApi = new genAI.GoogleGenerativeAI(apiKey);
    const model = genAIApi.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
        }
    });
    
    const prompt = constructPrompt(promptBrief);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const jsonStr = response.text().trim().replace(/```json\n?|\n?```/g, '');

        try {
            const parsedData = JSON.parse(jsonStr);
            if (typeof parsedData.generatedCopy === 'string') {
                return parsedData;
            } else {
                throw new Error("Invalid JSON structure from API.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("Funnel copy generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
