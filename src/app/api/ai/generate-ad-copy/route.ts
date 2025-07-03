
import { generateAdCopyFlow } from '@/ai/flows/generate-ad-copy';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { product, audience, platform } = await req.json();

    if (!product || !audience || !platform) {
      return NextResponse.json(
        { error: 'Missing product, audience, or platform' },
        { status: 400 }
      );
    }

    const adCopy = await generateAdCopyFlow.run({
      product,
      audience,
      platform,
    });

    return NextResponse.json(adCopy);
  } catch (error: any) {
    console.error('Error in generateAdCopy API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating ad copy.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
