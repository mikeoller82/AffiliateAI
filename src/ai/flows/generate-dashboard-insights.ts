
'use server';
/**
 * @fileOverview An AI agent that analyzes dashboard metrics and provides insights.
 *
 * - generateDashboardInsights - Analyzes metrics and returns insights and recommendations.
 * - GenerateDashboardInsightsInput - The input type for the function.
 * - GenerateDashboardInsightsOutput - The return type for the function.
 */

import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ai } from '@/ai/genkit';

const GenerateDashboardInsightsInputSchema = z.object({
  metrics: z.object({
    clicks: z.number(),
    conversions: z.number(),
    commission: z.number(),
  }),
  funnels: z.array(z.object({
      name: z.string(),
      ctr: z.number(),
      optInRate: z.number(),
  })).optional(),
  apiKey: z.string().describe('A Google AI API key for authentication.'),
});
export type GenerateDashboardInsightsInput = z.infer<typeof GenerateDashboardInsightsInputSchema>;

const GenerateDashboardInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('A list of 2-3 key, concise observations about the data. Frame these as an expert analyst speaking to the user.'),
  recommendations: z.array(z.object({
    title: z.string().describe('A short, catchy title for the recommendation.'),
    description: z.string().describe('A longer description explaining the recommendation and why it is important.'),
    ctaText: z.string().describe('The text for the call-to-action button.'),
    ctaLink: z.string().describe('The Next.js link for the call-to-action button (e.g., /dashboard/funnels).'),
    icon: z.string().describe('A relevant icon name from the lucide-react library (e.g., "Lightbulb", "BarChart").')
  })).describe('A list of 1-2 actionable recommendations for the user to take.')
});
export type GenerateDashboardInsightsOutput = z.infer<typeof GenerateDashboardInsightsOutputSchema>;

export async function generateDashboardInsights(input: GenerateDashboardInsightsInput): Promise<GenerateDashboardInsightsOutput> {
  return generateDashboardInsightsFlow(input);
}

const generateDashboardInsightsFlow = ai.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: GenerateDashboardInsightsInputSchema,
    outputSchema: GenerateDashboardInsightsOutputSchema,
  },
  async ({ metrics, funnels, apiKey }) => {
    const authAi = genkit({
      plugins: [googleAI({ apiKey })],
    });
    
    const funnelData = funnels && funnels.length > 0
        ? `Funnels Data: ${JSON.stringify(funnels)}`
        : "No funnel data available.";

    const prompt = `You are an expert marketing analyst for a platform called HighLaunchPad. Your tone is encouraging, insightful, and actionable.

      Analyze the following JSON data which contains key performance metrics for a user's dashboard.

      Metrics Data: ${JSON.stringify(metrics)}
      ${funnelData}

      Based on this data, your task is to provide:
      1.  A list of 2-3 `insights`. These should be concise observations about the data. Frame them as an expert analyst speaking to the user. For example: 'Your Lead Magnet funnel has a high click-through rate, but a low opt-in rate. This suggests the landing page copy might not be converting well.'
      2.  A list of 1-2 actionable `recommendations`. Each recommendation should have a title, a description of what to do, a call-to-action button text ('ctaText'), a Next.js link for that button ('ctaLink'), and a relevant 'icon' name from the lucide-react library.
      
      IMPORTANT:
      - If all metrics are zero or very low, provide encouraging and motivating recommendations for getting started, such as creating the first funnel or generating affiliate links.
      - Ensure the response is in the specified JSON format.
      - Make the insights and recommendations specific and directly related to the data provided.
    `;

    const {output} = await authAi.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: prompt,
      output: { 
          format: 'json',
          schema: GenerateDashboardInsightsOutputSchema
      },
    });

    if (!output) {
      throw new Error("AI failed to generate a response.");
    }
    return output;
  }
);
