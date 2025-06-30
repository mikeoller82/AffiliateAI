
import { NextRequest, NextResponse } from 'next/server';
import { suggestCTAs, SuggestCTAsInputSchema } from '@/ai/flows/suggest-ctas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = SuggestCTAsInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedBody.error.format() }, { status: 400 });
    }
    
    const result = await suggestCTAs(validatedBody.data);
    return NextResponse.json(result.ctas);
  } catch (error: any) {
    console.error('Error running suggestCTAs flow:', error);
    return NextResponse.json(
      { error: 'An error occurred while suggesting CTAs.', details: error.message },
      { status: 500 }
    );
  }
}
