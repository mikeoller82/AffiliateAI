
import { NextRequest, NextResponse } from 'next/server';
import { editText, type EditTextInput } from '@/ai/flows/edit-text';

export async function POST(req: NextRequest) {
  try {
    const body: EditTextInput = await req.json();
    
    const { text, instruction, apiKey } = body;
    if (typeof text !== 'string' || typeof instruction !== 'string') {
        return NextResponse.json({ error: 'Invalid input', details: 'Missing text or instruction.' }, { status: 400 });
    }

    const result = await editText({ text, instruction, apiKey });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in editText API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while editing text.', details: error.message },
      { status: 500 }
    );
  }
}
