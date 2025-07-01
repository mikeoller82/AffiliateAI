export interface CampaignBrief {
  audience: string;
  product: string;
  goal: string;
  tone: string;
  apiKey?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface AdCopyBrief {
  product: string;
  audience: string;
  platform: string;
  apiKey?: string;
}

export interface GeneratedAdCopy {
  headlines: string[];
  primary_text: string;
  descriptions: string[];
}

// Types for Dashboard Insights
interface FunnelPerformance {
  name: string;
  ctr: string;
  optInRate: string;
}

interface Metrics {
  clicks: number;
  conversions: number;
  commission: number;
}

export interface DashboardData {
  metrics: Metrics;
  funnels: FunnelPerformance[];
  apiKey?: string;
}

interface Recommendation {
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  ctaLink: string;
}

export interface GeneratedInsights {
  insights: string[];
  recommendations: Recommendation[];
}

// Types for Funnel Copy
export interface FunnelCopyBrief {
    productDescription: string;
    copyType: string;
    userPrompt: string;
    apiKey?: string;
}

export interface GeneratedFunnelCopy {
    generatedCopy: string;
}

// Types for Product Hook
export interface ProductHookBrief {
    productDescription: string;
    emotion: string;
    apiKey?: string;
}

export interface GeneratedProductHooks {
    hooks: string[];
}

// Types for Product Review
export interface ProductReviewBrief {
    productName: string;
    features: string;
    apiKey?: string;
}

export interface GeneratedProductReview {
    review: string;
}

// Types for CTA Suggestions
export interface CTABrief {
    context: string;
    apiKey?: string;
}

export interface GeneratedCTAs {
    ctas: string[];
}

// Types for Image Generation
export interface ImageGenerationBrief {
    prompt: string;
    style?: string;
    apiKey?: string;
}

export interface GeneratedImage {
    imageDataUri: string;
}

// Types for AI Text Editing
export interface EditTextInput {
    text: string;
    instruction: string;
    apiKey?: string;
}

export interface EditTextOutput {
    editedText: string;
}
