
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateDashboardInsightsFlow = genkit.defineFlow(
  {
    name: 'generateDashboardInsightsFlow',
    inputSchema: z.object({
      metrics: z.object({
        clicks: z.number(),
        conversions: z.number(),
        commission: z.number(),
      }),
      funnels: z.array(
        z.object({
          name: z.string(),
          ctr: z.string(),
          optInRate: z.string(),
        })
      ),
    }),
    outputSchema: z.object({
      insights: z.array(z.string()),
      recommendations: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          ctaText: z.string(),
          ctaLink: z.string(),
        })
      ),
    }),
  },
  async (data) => {
    const funnelData = data.funnels
      .map(
        (f) => `
    *   **Funnel: ${f.name}**
        *   Click-Through Rate (CTR): ${f.ctr}
        *   Opt-In Rate: ${f.optInRate}
  `
      )
      .join('');

    const prompt = `
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

    Output structured data that adheres to the provided JSON schema.
  `;

    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt,
      output: {
        schema: z.object({
          insights: z.array(z.string()),
          recommendations: z.array(
            z.object({
              title: z.string(),
              description: z.string(),
              icon: z.string(),
              ctaText: z.string(),
              ctaLink: z.string(),
            })
          ),
        }),
      },
    });

    return llmResponse.output();
  }
);
