
import { editTextFlow } from '@/ai/flows/edit-text';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, instruction } = await req.json();

    if (!text || !instruction) {
      return NextResponse.json(
        { error: 'Missing text or instruction' },
        { status: 400 }
      );
    }

    const editedText = await editTextFlow.run({ text, instruction });

    return NextResponse.json({ editedText });
  } catch (error: any) {
    console.error('Error in editText API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while editing text.', details: error.message },
      { status: 500 }
    );
  }
}
