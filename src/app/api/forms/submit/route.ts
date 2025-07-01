
import { type NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/firebase-crm-api';

export async function POST(request: NextRequest) {
     try {
        const body = await request.json();
        const { formData, ownerId, formName } = body;

        if (!ownerId || !formData || !formName) {
            return NextResponse.json({ error: 'Missing ownerId, formData, or formName' }, { status: 400 });
        }
        
        // In a real app, you might want to validate the ownerId exists before creating a lead.
        // For this implementation, we trust the ownerId from the form settings.
        
        const leadData = {
            name: formData.name || formData.first_name || formData['full_name'] || 'New Lead from Form',
            company: formData.company || 'N/A',
            email: formData.email || '',
            value: 0, 
            tags: ['Form Submission', formName],
            score: 50,
            stage: 'newLeads' as const
        };
        
        await createLead(ownerId, leadData);

        return NextResponse.json({ success: true, message: 'Form submitted successfully.' });
    } catch (error: any) {
        console.error('Error submitting form:', error);
        return NextResponse.json({ error: 'Failed to submit form', details: error.message }, { status: 500 });
    }
}
