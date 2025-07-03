
import { generateProductReviewFlow } from '@/ai/flows/generate-product-review';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productName, features } = await req.json();

    if (!productName || !features) {
      return NextResponse.json(
        { error: 'Missing productName or features' },
        { status: 400 }
      );
    }

    const review = await generateProductReviewFlow.run({
      productName,
      features,
    });

    return NextResponse.json({ review });
  } catch (error: any) {
    console.error('Error in generateProductReview API route:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while generating the product review.',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
