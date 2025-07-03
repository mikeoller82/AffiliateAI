
import { NextRequest, NextResponse } from 'next/server';
import { suggestCTAs, CTABrief } from '@/ai/flows/suggest-ctas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { context, apiKey } = body;
    if (typeof context !== 'string') {
        return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid context field.' }, { status: 400 });
    }
    
    const brief: CTABrief = { context, apiKey };
    
    const result = await suggestCTAs(brief);
    
    return NextResponse.json(result.ctas);
  } catch (error: any)
  {
    console.error('Error in suggestCTAs API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while suggesting CTAs.', details: error.message },
      { status: 500 }
    );
  }
}
