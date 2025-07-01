
'use server';
/**
 * @fileOverview AI flow for generating dashboard insights.
 */
import { GoogleGenAI } from "@google/genai";
import { DashboardData, GeneratedInsights } from '../types';

const constructPrompt = (data: Omit<DashboardData, 'apiKey'>): string => {
  const funnelData = data.funnels.map(f => `
    *   **Funnel: ${f.name}**
        *   Click-Through Rate (CTR): ${f.ctr}
        *   Opt-In Rate: ${f.optInRate}
  `).join('');

  return `
    You are a world-class expert in Marketing Analysis.
    Your task is to analyze the following marketing data and provide actionable insights and recommendations for a digital marketer.

    **Data Provided:**
    *   **Overall Metrics:**
        *   Total Clicks: ${data.metrics.clicks}
        *   Total Conversions: ${data.metrics.conversions}
        *   Total Commission: $${data.metrics.commission}
    *   **Funnel Performance:**${funnelData}

    **Your Task:**
    1.  Generate a list of 3-4 key, data-driven observations for the "insights" field. These should be concise and directly related to the provided data.
    2.  Generate a list of 3 actionable recommendations for the "recommendations" field. Each recommendation should be practical and aimed at improving the user's marketing performance.
    3.  For each recommendation, provide a title, a brief description, a relevant Lucide icon name (e.g., 'Target', 'DollarSign', 'LineChart'), a call-to-action text, and a relevant relative URL.

    **Output Format:**
    Return your response as a valid JSON object. Do not wrap it in markdown backticks.
    The JSON object must have two keys: "insights" (an array of strings) and "recommendations" (an array of objects with the specified structure).

    Example JSON output:
    {
      "insights": [
        "Insight number one based on the data.",
        "Insight number two, highlighting a key trend."
      ],
      "recommendations": [
        {
          "title": "Optimize Funnel 'A'",
          "description": "The CTR for Funnel 'A' is underperforming. Consider testing new ad creatives or landing page headlines.",
          "icon": "Target",
          "ctaText": "View Funnel",
          "ctaLink": "/dashboard/funnels/a"
        },
        {
          "title": "Boost Conversions",
          "description": "Your overall conversion rate could be improved. Try creating a special offer for your best-selling product.",
          "icon": "DollarSign",
          "ctaText": "Create Offer",
          "ctaLink": "/dashboard/offers/new"
        }
      ]
    }
  `;
};

export const generateDashboardInsights = async (data: DashboardData): Promise<GeneratedInsights> => {
    const { apiKey, ...promptData } = data;

    if (!apiKey) {
        throw new Error("API key is required for generating dashboard insights.");
    }
    
    const prompt = constructPrompt(promptData);
    const ai = new GoogleGenAI(apiKey);

    try {
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash-preview-0514",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.6,
                topP: 1.0,
            }
        });
        const result = await model.generateContent(prompt);
        const response = result.response;
        
        const jsonStr = response.text().trim().replace(/```json\n?|\n?```/g, '');

        try {
            const parsedData = JSON.parse(jsonStr);
            if (Array.isArray(parsedData.insights) && Array.isArray(parsedData.recommendations)) {
                const isValid = parsedData.recommendations.every((rec: any) => 
                    typeof rec.title === 'string' &&
                    typeof rec.description === 'string' &&
                    typeof rec.icon === 'string' &&
                    typeof rec.ctaText === 'string' &&
                    typeof rec.ctaLink === 'string'
                );
                if (isValid) {
                    return parsedData;
                }
            }
            throw new Error("Invalid JSON structure from API.");
        } catch (e: any) {
            console.error("JSON parsing error:", e.message, "\nRaw AI response:", jsonStr);
            throw new Error("The AI returned a malformed response. Please try again.");
        }

    } catch (error: any) {
        console.error("Dashboard insights generation error:", error);
        if (error.message.includes('API key not valid')) {
             throw new Error("Your API key is invalid. Please check it and try again.");
        }
        throw new Error("Failed to communicate with the AI service.");
    }
};
