// Helper function to create a consistent prompt structure
function createPrompt(title: string, content: string): string {
    return `You are a world-class expert in ${title}.

${content}

IMPORTANT: Return only valid JSON without any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other formatting.`;
}

// Validation helper for ensuring clean JSON responses
function sanitizeJsonPrompt(basePrompt: string): string {
    return `${basePrompt}

CRITICAL FORMATTING RULES:
- Return ONLY the JSON object
- No markdown code blocks (\`\`\`json)
- No explanatory text before or after
- Ensure all JSON strings are properly escaped
- Use double quotes for all JSON keys and string values`;
}

// Prompts for each AI tool

export function generateDashboardInsights(
    metrics: { clicks: number; conversions: number; commission: number }, 
    funnels: { name: string; ctr: string; optInRate: string }[]
): string {
    const funnelDetails = funnels.map(f => 
        `• **Funnel: ${f.name}**
  - Click-Through Rate (CTR): ${f.ctr}
  - Opt-In Rate: ${f.optInRate}`
    ).join('\n');

    const conversionRate = metrics.clicks > 0 ? ((metrics.conversions / metrics.clicks) * 100).toFixed(2) : '0';
    const avgCommissionPerConversion = metrics.conversions > 0 ? (metrics.commission / metrics.conversions).toFixed(2) : '0';

    const basePrompt = createPrompt('Marketing Analysis and Data Interpretation', `
Your task is to analyze the following marketing data and provide actionable insights and recommendations for a digital marketer.

**Performance Data:**
• **Overall Metrics:**
  - Total Clicks: ${metrics.clicks.toLocaleString()}
  - Total Conversions: ${metrics.conversions.toLocaleString()}
  - Total Commission: $${metrics.commission.toLocaleString()}
  - Conversion Rate: ${conversionRate}%
  - Average Commission per Conversion: $${avgCommissionPerConversion}

• **Funnel Performance:**
${funnelDetails}

**Required Output Format:**
Generate a JSON object with exactly these keys:
{
  "insights": [
    "First key data-driven observation with specific numbers",
    "Second insight about funnel performance patterns",
    "Third insight about optimization opportunities",
    "Fourth insight about market positioning (if applicable)"
  ],
  "recommendations": [
    {
      "title": "Short actionable title",
      "description": "Detailed explanation of the recommendation",
      "icon": "relevant-icon-name",
      "ctaText": "Action button text",
      "ctaLink": "#relevant-section"
    }
  ]
}

Focus on specific, data-driven insights and actionable recommendations that can immediately improve performance.`);

    return sanitizeJsonPrompt(basePrompt);
}

export function generateAdCopy(product: string, audience: string, platform: string): string {
    const platformGuidelines = {
        'Facebook': 'Facebook ads should be conversational and story-driven with strong social proof',
        'Google': 'Google ads should be search-intent focused with clear value propositions',
        'Instagram': 'Instagram ads should be visually compelling with lifestyle-focused copy',
        'LinkedIn': 'LinkedIn ads should be professional and benefit-focused',
        'TikTok': 'TikTok ads should be authentic, trend-aware, and entertainment-focused',
        'Twitter': 'Twitter ads should be concise, timely, and conversation-starting'
    };

    const guideline = platformGuidelines[platform as keyof typeof platformGuidelines] || 'Focus on platform-appropriate messaging';

    const basePrompt = createPrompt('Direct-Response Copywriting and Digital Advertising', `
Generate compelling ad copy variations optimized for the specific platform and audience.

**Campaign Details:**
• Product/Service: ${product}
• Target Audience: ${audience}
• Platform: ${platform}
• Platform Guidelines: ${guideline}

**Requirements:**
Create 3-5 high-converting variations that:
- Grab attention in the first 3 words
- Address the audience's pain points or desires
- Include clear value propositions
- Have strong calls-to-action
- Follow platform best practices

**Required Output Format:**
{
  "headlines": [
    "Attention-grabbing headline 1 (max 40 chars for mobile)",
    "Headlines should create curiosity or urgency",
    "Include benefit-driven headlines",
    "Add social proof headlines if applicable",
    "Use power words and emotional triggers"
  ],
  "primary_text": "Engaging opening sentence that hooks the reader. Follow with 2-3 sentences that build desire and create urgency. Include social proof if relevant. End with a compelling call-to-action that drives the desired behavior.",
  "descriptions": [
    "Short, punchy description focusing on main benefit",
    "Problem-solution focused description",
    "Social proof or testimonial-style description",
    "Urgency or scarcity-driven description",
    "Feature-to-benefit conversion description"
  ]
}

Make each variation distinct and test-worthy.`);

    return sanitizeJsonPrompt(basePrompt);
}

export function suggestCTAs(context: string): string {
    const basePrompt = createPrompt('Conversion Rate Optimization and Marketing Psychology', `
Generate compelling Call-To-Action (CTA) suggestions optimized for maximum conversion.

**Context:** ${context}

**Requirements:**
Create 5-7 high-converting CTAs that:
- Use action-oriented language
- Create urgency or curiosity
- Address different psychological triggers
- Vary in length and approach
- Are specific to the context provided

**Output Format:**
{
  "ctas": [
    {
      "text": "CTA button text",
      "type": "urgency|curiosity|benefit|social_proof|fear_of_missing_out",
      "context": "When to use this CTA variant",
      "conversion_psychology": "Why this CTA works"
    }
  ]
}

Include CTAs for different stages of the funnel (awareness, consideration, decision).`);

    return sanitizeJsonPrompt(basePrompt);
}

export function generateProductReview(productName: string, features: string): string {
    const basePrompt = createPrompt('SEO Copywriting, Affiliate Marketing, and Product Reviews', `
Generate a comprehensive, engaging, and SEO-optimized product review in Markdown format.

**Product Details:**
• Product Name: ${productName}
• Key Features/Benefits: ${features}

**Review Structure Requirements:**
1. **Compelling Introduction** (2-3 paragraphs)
   - Hook the reader with a relatable problem or question
   - Introduce the product naturally
   - Preview what the review will cover

2. **Detailed Pros Section** (4-6 bullet points)
   - Focus on real benefits, not just features
   - Include specific examples or use cases
   - Mention any standout qualities

3. **Honest Cons Section** (2-4 bullet points)
   - Address genuine limitations or considerations
   - Maintain credibility with balanced perspective
   - Suggest who might not be the ideal user

4. **Final Verdict** (2-3 paragraphs)
   - Summarize overall value proposition
   - Make clear recommendation with reasoning
   - Include call-to-action if appropriate

**SEO Requirements:**
- Use natural keyword integration
- Include semantic variations
- Write for humans first, search engines second
- Aim for 800-1200 words total

Return the complete review in proper Markdown formatting.`);

    return basePrompt;
}

export function generateProductHook(productDescription: string, emotion: string): string {
    const emotionGuidelines = {
        'excitement': 'Use power words, urgency, and exclusive language',
        'curiosity': 'Ask intriguing questions and tease benefits',
        'fear': 'Highlight problems and consequences of inaction',
        'desire': 'Paint vivid pictures of transformation',
        'trust': 'Use social proof and authority indicators',
        'urgency': 'Emphasize scarcity and time-sensitive offers'
    };

    const guideline = emotionGuidelines[emotion.toLowerCase() as keyof typeof emotionGuidelines] || 'Focus on emotional resonance';

    const basePrompt = createPrompt('Viral Marketing and Hook Writing', `
Generate short, punchy marketing hooks designed to stop the scroll and trigger engagement.

**Product Information:**
${productDescription}

**Target Emotion:** ${emotion}
**Emotional Strategy:** ${guideline}

**Hook Requirements:**
- Maximum 15-20 words each
- First 3 words must grab attention
- Create immediate emotional response
- Make audience want to know more
- Be authentic and believable

**Output Format:**
{
  "hooks": [
    {
      "text": "Hook text here",
      "emotional_trigger": "Primary emotion targeted",
      "use_case": "Best platform or context for this hook",
      "follow_up": "Suggested next line or expansion"
    }
  ]
}

Create 5-7 distinct hooks with different approaches to the same emotion.`);

    return sanitizeJsonPrompt(basePrompt);
}

export function generateEmailContent(objective: string, tone: string, productDetails: string): string {
    const toneGuidelines = {
        'professional': 'Formal, respectful, benefit-focused language',
        'casual': 'Conversational, friendly, relatable tone',
        'urgent': 'Time-sensitive language with clear consequences',
        'educational': 'Informative, helpful, value-first approach',
        'personal': 'Intimate, story-driven, one-on-one feel'
    };

    const guideline = toneGuidelines[tone.toLowerCase() as keyof typeof toneGuidelines] || 'Match the specified tone consistently';

    const basePrompt = createPrompt('Email Marketing and Direct Response Copywriting', `
Generate high-converting email content optimized for engagement and action.

**Email Campaign Details:**
• Objective: ${objective}
• Tone: ${tone}
• Tone Guidelines: ${guideline}
• Product/Service Details: ${productDetails}

**Content Requirements:**
- Subject lines that achieve high open rates
- Email body that drives the desired action
- Personalized and relevant messaging
- Clear value proposition
- Strong call-to-action

**Subject Line Criteria:**
- 30-50 characters for mobile optimization
- Create curiosity or urgency
- Avoid spam trigger words
- Be specific and benefit-focused
- Test different psychological triggers

**Email Body Requirements:**
- Compelling opening that references subject line
- Logical flow that builds toward the CTA
- Address reader's pain points and desires
- Include social proof if applicable
- Multiple CTA opportunities
- Professional closing

**Output Format:**
{
  "subjectLines": [
    "Curiosity-driven subject line",
    "Benefit-focused subject line", 
    "Urgency-based subject line",
    "Personal/story-driven subject line",
    "Question-based subject line"
  ],
  "body": "Complete email body with proper formatting, including:\n- Engaging opening\n- Value-driven content\n- Clear call-to-action\n- Professional signature\n\nUse \\n for line breaks and maintain proper email formatting."
}

Ensure all content aligns with the specified objective and tone.`);

    return sanitizeJsonPrompt(basePrompt);
}

// Utility function for prompt validation
export function validatePromptInputs(inputs: Record<string, any>): string[] {
    const errors: string[] = [];
    
    Object.entries(inputs).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            errors.push(`${key} is required and cannot be empty`);
        }
        if (typeof value === 'string' && value.trim().length === 0) {
            errors.push(`${key} cannot be just whitespace`);
        }
    });
    
    return errors;
}

// Helper for dynamic prompt customization
export function customizePrompt(basePrompt: string, customizations: Record<string, string>): string {
    let customizedPrompt = basePrompt;
    
    Object.entries(customizations).forEach(([placeholder, replacement]) => {
        const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
        customizedPrompt = customizedPrompt.replace(regex, replacement);
    });
    
    return customizedPrompt;
}