
'use server';
/**
 * @fileOverview AI flow for generating ad copy.
 */
import { GoogleGenerativeAI } from "@google/genai";
import { AdCopyBrief, GeneratedAdCopy } from '../types';

const constructPrompt = (brief: Omit<AdCopyBrief, 'apiKey'>): string => {
  return `
    You are a world-class expert in Direct-Response Copywriting.
    Your task is to generate compelling ad copy based on the following brief.

    **Ad Copy Brief:**
    - **Product/Service:** ${brief.product}
    - **Target Audience:** ${brief.audience}
    - **Platform:** ${brief.platform}

    **Instructions:**
    1.  Create 3-5 compelling, attention-grabbing headlines.
    2.  Write a persuasive primary text for the ad body.
    3.  Create 3-5 concise and relevant descriptions.
    4.  Ensure the tone and style are appropriate for the specified platform.

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks. 
    The JSON object must have three keys: 
    - "headlines": an array of strings.
    - "primary_text": a string.
    - "descriptions": an array of strings.

    Example JSON output:
    {
      "headlines": ["Headline 1", "Headline 2", "Headline 3"],
      "primary_text": "This is the main ad copy. It should be persuasive and engaging.",
      "descriptions": ["Description 1", "Description 2"]
    }
  `;
};

export const generateAdCopy = async (brief: AdCopyBrief): Promise<GeneratedAdCopy> => {
    const { apiKey, ...promptBrief } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for ad copy generation.");
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
            if (Array.isArray(parsedData.headlines) && 
                typeof parsedData.primary_text === 'string' && 
                Array.isArray(parsedData.descriptions)) {
                return parsedData;
            } else {
                throw new Error("Invalid JSON structure received from the AI.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("Ad copy generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
