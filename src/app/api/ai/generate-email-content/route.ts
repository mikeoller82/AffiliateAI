
import { NextRequest, NextResponse } from 'next/server';
import { generateEmailContent, GenerateEmailContentInputSchema } from '@/ai/flows/generate-email-content';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = GenerateEmailContentInputSchema.safeParse(body);
    if (!validatedBody.success) {
      return NextResponse.json({ error: 'Invalid input', details: validatedBody.error.format() }, { status: 400 });
    }
    
    const result = await generateEmailContent(validatedBody.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error running generateEmailContent flow:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating email content.', details: error.message },
      { status: 500 }
    );
  }
}
