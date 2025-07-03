
'use server';
/**
 * @fileOverview AI flow for generating product marketing hooks.
 * This file has been corrected to use the standard Google AI SDK pattern.
 */
import { GoogleGenerativeAI } from "@google/genai";
import { ProductHookBrief, GeneratedProductHooks } from '../types';

const constructPrompt = (brief: Omit<ProductHookBrief, 'apiKey'>): string => {
  return `
    You are an expert in Viral Marketing.
    Your task is to generate 3-5 short, punchy marketing hook ideas designed to grab attention and evoke a specific emotion.

    **Product Description:** ${brief.productDescription}
    **Target Emotion:** ${brief.emotion}

    **Instructions:**
    - Generate hooks that are concise and memorable.
    - Each hook should strongly resonate with the target emotion.
    - The hooks should be directly related to the product.

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks.
    The JSON object must have a single key: "hooks", which is an array of strings.

    Example JSON output:
    {
      "hooks": [
        "Hook idea number one.",
        "A second, more curiosity-driven hook.",
        "The final hook, focused on transformation."
      ]
    }
  `;
};

export const generateProductHook = async (brief: ProductHookBrief): Promise<GeneratedProductHooks> => {
    const { apiKey, ...promptBrief } = brief;

    if (!apiKey) {
        throw new Error("API key is required for product hook generation.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9,
        }
    });

    const prompt = constructPrompt(promptBrief);

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const jsonStr = response.text().trim().replace(/```json\n?|\n?```/g, '');

        try {
            const parsedData = JSON.parse(jsonStr);
            if (Array.isArray(parsedData.hooks)) {
                return parsedData;
            } else {
                throw new Error("Invalid JSON structure from API.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("Product hook generation error:", error);
         if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
