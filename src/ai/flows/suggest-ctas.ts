
'use server';
/**
 * @fileOverview AI flow for suggesting Call-To-Action phrases.
 */
import { GoogleGenerativeAI } from "@google/genai";
import { CTABrief, GeneratedCTAs } from '../types';

const constructPrompt = (brief: Omit<CTABrief, 'apiKey'>): string => {
  return `
    You are a world-class expert in Marketing Strategy and Conversion Rate Optimization.
    Your task is to suggest 3-5 compelling Call-To-Action (CTA) phrases for the given context.

    **Context:** ${brief.context}

    **Instructions:**
    - The CTAs should be short, punchy, and action-oriented.
    - Tailor the CTAs to be highly relevant to the provided context.
    - Focus on creating a sense of urgency or clear benefit for the user.

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks.
    The JSON object must have a single key: "ctas", which is an array of strings.

    Example JSON output:
    {
      "ctas": [
        "Sign Up Now, It's Free!",
        "Reserve My Spot",
        "Get Instant Access"
      ]
    }
  `;
};

export const suggestCTAs = async (brief: CTABrief): Promise<GeneratedCTAs> => {
    const { apiKey, ...promptBrief } = brief;

    if (!apiKey) {
        throw new Error("API key is required for CTA suggestion.");
    }
    
    const prompt = constructPrompt(promptBrief);
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.8,
                topP: 0.9,
            }
        });
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const jsonStr = response.text().trim().replace(/```json\n?|\n?```/g, '');

        try {
            const parsedData = JSON.parse(jsonStr);
            if (Array.isArray(parsedData.ctas)) {
                return { ctas: parsedData.ctas };
            } else {
                throw new Error("Invalid JSON structure from API.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("CTA suggestion error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
