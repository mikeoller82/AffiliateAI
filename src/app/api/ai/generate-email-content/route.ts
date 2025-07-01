
import { NextRequest, NextResponse } from 'next/server';
import { generateEmailCampaign, CampaignBrief } from '@/ai/flows/generate-email-content';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation, since we're not using Zod in the new implementation
    const { audience, product, goal, tone, apiKey } = body;
    if (typeof audience !== 'string' || typeof product !== 'string' || typeof goal !== 'string' || typeof tone !== 'string') {
        return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid campaign brief fields.' }, { status: 400 });
    }
    
    const brief: CampaignBrief = { audience, product, goal, tone, apiKey };
    
    const result = await generateEmailCampaign(brief);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateEmailCampaign API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the email campaign.', details: error.message },
      { status: 500 }
    );
  }
}
