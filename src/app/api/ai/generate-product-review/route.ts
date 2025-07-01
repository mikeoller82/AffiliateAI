
import { NextRequest, NextResponse } from 'next/server';
import { generateProductReview, ProductReviewBrief } from '@/ai/flows/generate-product-review';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { productName, features, apiKey } = body;
    if (typeof productName !== 'string' || typeof features !== 'string') {
        return NextResponse.json({ error: 'Invalid input', details: 'Missing or invalid product review brief fields.' }, { status: 400 });
    }
    
    const brief: ProductReviewBrief = { productName, features, apiKey };
    
    const result = await generateProductReview(brief);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generateProductReview API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the product review.', details: error.message },
      { status: 500 }
    );
  }
}
