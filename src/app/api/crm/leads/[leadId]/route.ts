
import { type NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth } from '@/lib/firebase-admin';
import { updateLeadStage } from '@/lib/firebase-crm-api';
import type { PipelineStage } from '@/lib/crm-types';

export async function PUT(request: NextRequest, { params }: { params: { leadId: string } }) {
    const { leadId } = params;
    try {
        const sessionCookie = request.cookies.get('__session')?.value || '';
        const decodedToken = await getFirebaseAuth().verifySessionCookie(sessionCookie, true);
        const userId = decodedToken.uid;

        const { stage } = await request.json();
        
        const validStages: PipelineStage[] = ['newLeads', 'contacted', 'proposalSent', 'won'];
        if (!stage || !validStages.includes(stage)) {
            return NextResponse.json({ error: 'A valid stage is required' }, { status: 400 });
        }

        await updateLeadStage(userId, leadId, stage);

        return NextResponse.json({ success: true, message: 'Lead stage updated.' });

    } catch (error: any) {
        console.error(`Error updating lead ${leadId}:`, error);
        return NextResponse.json({ error: 'Failed to update lead', details: error.message }, { status: 500 });
    }
}
