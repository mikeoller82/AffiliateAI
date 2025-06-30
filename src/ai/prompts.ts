// Helper function to create a consistent prompt structure
function createPrompt(title: string, content: string): string {
    return `You are a world-class expert in ${title}.

${content}`;
}

// Prompts for each AI tool

export function generateDashboardInsights(
    metrics: { clicks: number; conversions: number; commission: number }, 
    funnels: { name: string; ctr: string; optInRate: string }[]
): string {
    const funnelDetails = funnels.map(f => 
        `*   **Funnel: ${f.name}**
    *   Click-Through Rate (CTR): ${f.ctr}
    *   Opt-In Rate: ${f.optInRate}`
    ).join('\n');

    return createPrompt('Marketing Analysis', `
Your task is to analyze the following marketing data and provide actionable insights and recommendations for a digital marketer.

**Data Provided:**
*   **Overall Metrics:**
    *   Total Clicks: ${metrics.clicks}
    *   Total Conversions: ${metrics.conversions}
    *   Total Commission: $${metrics.commission}
*   **Funnel Performance:**
${funnelDetails}

**Your Task:**
Generate a JSON object with two keys: "insights" and "recommendations".
1.  **insights**: A bulleted list of 3-4 key, data-driven observations.
2.  **recommendations**: A list of 3 actionable recommendations with the structure: \`{ title, description, icon, ctaText, ctaLink }\`.

Return only the raw JSON object.`);
}

export function generateAdCopy(product: string, audience: string, platform: string): string {
    return createPrompt('Direct-Response Copywriting', `
Generate compelling ad copy variations based on the product, audience, and platform.

**Product:** ${product}
**Audience:** ${audience}
**Platform:** ${platform}

Generate 3-5 variations for headlines and descriptions. The primary text should be engaging and relevant.

**Output JSON:** \`{ "headlines": [], "primary_text": "", "descriptions": [] }\``);
}

export function suggestCTAs(context: string): string {
    return createPrompt('Marketing Strategy', `
Suggest 3-5 compelling Call-To-Actions (CTAs) for the given context.

**Context:** ${context}`);
}

export function generateProductReview(productName: string, features: string): string {
    return createPrompt('SEO Copywriting and Affiliate Marketing', `
Generate a well-structured and engaging product review in Markdown format.

**Product Name:** ${productName}
**Key Features/Talking Points:** ${features}

**Structure:**
- Catchy introduction
- "Pros" section (bulleted)
- "Cons" section (bulleted)
- Concluding summary`);
}

export function generateProductHook(productDescription: string, emotion: string): string {
    return createPrompt('Viral Marketing', `
Generate 3-5 short, punchy marketing hook ideas designed to grab attention and evoke a specific emotion.

**Product Description:** ${productDescription}
**Target Emotion:** ${emotion}`);
}

export function generateEmailContent(objective: string, tone: string, productDetails: string): string {
    return createPrompt('Email Copywriting', `
Generate email subject lines and body copy based on the provided information.

**Objective:** ${objective}
**Tone:** ${tone}
**Product Details:** ${productDetails}

**Output JSON:** \`{ "subjectLines": [], "body": "" }\``);
}
