
import { NextRequest, NextResponse } from 'next/server';
import { generateProductHook, ProductHookBrief } from '@/ai/flows/generate-product-hook';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { productDescription, emotion, apiKey } = body;
    if (typeof productDescription !== 'string' || typeof emotion !== 'string') {
        return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid product hook brief fields.' }, { status: 400 });
    }
    
    const brief: ProductHookBrief = { productDescription, emotion, apiKey };

    const result = await generateProductHook(brief);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateProductHook API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating product hooks.', details: error.message },
      { status: 500 }
    );
  }
}
