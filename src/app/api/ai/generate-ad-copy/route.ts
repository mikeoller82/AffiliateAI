
import { NextRequest, NextResponse } from 'next/server';
import { generateAdCopy, AdCopyBrief } from '@/ai/flows/generate-ad-copy';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { product, audience, platform, apiKey } = body;
    if (typeof product !== 'string' || typeof audience !== 'string' || typeof platform !== 'string') {
        return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid ad copy brief fields.' }, { status: 400 });
    }

    const brief: AdCopyBrief = { product, audience, platform, apiKey };
    
    const result = await generateAdCopy(brief);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateAdCopy API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating ad copy.', details: error.message },
      { status: 500 }
    );
  }
}
