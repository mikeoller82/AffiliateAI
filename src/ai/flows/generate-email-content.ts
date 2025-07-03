
import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const generateEmailContentFlow = ai.defineFlow(
  {
    name: 'generateEmailContentFlow',
    inputSchema: z.object({
      audience: z.string(),
      product: z.string(),
      goal: z.string(),
      tone: z.string(),
    }),
    outputSchema: z.object({
      subject: z.string(),
      body: z.string(),
    }),
  },
  async ({ audience, product, goal, tone }) => {
    const prompt = `
    You are an expert marketing copywriter and CRM specialist. Your task is to generate a compelling marketing email based on the following brief.

    **Campaign Brief:**
    - **Target Audience:** ${audience}
    - **Product/Service:** ${product}
    - **Key Goal:** ${goal}
    - **Desired Tone:** ${tone}

    **Instructions:**
    1.  Create a compelling, attention-grabbing subject line.
    2.  Write a persuasive email body. The body should be in simple HTML format (using tags like <p>, <strong>, <em>, <ul>, <li>, <a>).
    3.  Address the target audience directly.
    4.  Clearly explain the value proposition of the product/service.
    5.  Include a strong call to action related to the campaign goal.
    6.  Ensure the tone of the email matches the desired tone from the brief.

    Output structured data that adheres to the provided JSON schema.
  `;

    const llmResponse = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash'),
      prompt,
      output: {
        schema: z.object({
          subject: z.string(),
          body: z.string(),
        }),
      },
    });

    return llmResponse.output();
  }
);
