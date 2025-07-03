
'use server';
/**
 * @fileOverview AI flow for generating a product review.
 * This file has been corrected to use the standard Google AI SDK pattern.
 */
import { GoogleGenerativeAI } from "@google/genai";
import { ProductReviewBrief, GeneratedProductReview } from '../types';

const constructPrompt = (brief: Omit<ProductReviewBrief, 'apiKey'>): string => {
  return `
    You are an expert in SEO Copywriting and Affiliate Marketing.
    Your task is to generate a well-structured and engaging product review in Markdown format.

    **Product Name:** ${brief.productName}
    **Key Features/Talking Points:** ${brief.features}

    **Instructions:**
    - Create a catchy introduction to grab the reader's attention.
    - Write a "Pros" section with bullet points highlighting the product's strengths.
    - Write a "Cons" section with bullet points for a balanced perspective.
    - Provide a concluding summary that helps the reader make a decision.
    - The entire output should be a single string in Markdown format.

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks.
    The JSON object must have a single key: "review", which is a string containing the full review in Markdown.

    Example JSON output:
    {
      "review": "### Awesome Product Review\\n\\nThis is a great product...\\n\\n**Pros:**\\n- It's fast\\n- It's easy to use\\n\\n**Cons:**\\n- It's a bit expensive\\n\\nOverall, a solid choice."
    }
  `;
};

export const generateProductReview = async (brief: ProductReviewBrief): Promise<GeneratedProductReview> => {
    const { apiKey, ...promptBrief } = brief;
    
    if (!apiKey) {
        throw new Error("API key is required for product review generation.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
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
            if (typeof parsedData.review === 'string') {
                return parsedData;
            } else {
                throw new Error("Invalid JSON structure from API.");
            }
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("Product review generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
         if (error.message.includes('400 Bad Request')) {
             throw new Error("The AI service rejected the request. Your API key might be invalid or restricted.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
