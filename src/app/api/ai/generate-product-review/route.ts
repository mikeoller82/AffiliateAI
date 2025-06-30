
import { NextRequest, NextResponse } from 'next/server';
import { generateProductReview, GenerateProductReviewInputSchema } from '@/ai/flows/generate-product-review';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = GenerateProductReviewInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedBody.error.format() }, { status: 400 });
    }
    
    const result = await generateProductReview(validatedBody.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running generateProductReview flow:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating the product review.', details: error.message },
      { status: 500 }
    );
  }
}
