
import { type NextRequest, NextResponse } from 'next/server';
import { getFirebaseAuth } from '@/lib/firebase-admin';
import { createLead, getLeads } from '@/lib/firebase-crm-api';
import type { Lead } from '@/lib/crm-types';

export async function GET(request: NextRequest) {
    try {
        const sessionCookie = request.cookies.get('__session')?.value || '';
        const decodedToken = await getFirebaseAuth().verifySessionCookie(sessionCookie, true);
        const userId = decodedToken.uid;

        const leads = await getLeads(userId);
        return NextResponse.json(leads);

    } catch (error: any) {
        console.error('Error fetching leads:', error);
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/session-cookie-revoked') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
     try {
        const sessionCookie = request.cookies.get('__session')?.value || '';
        const decodedToken = await getFirebaseAuth().verifySessionCookie(sessionCookie, true);
        const userId = decodedToken.uid;

        const body: Omit<Lead, 'id' | 'createdAt' | 'userId' | 'stage'> = await request.json();
        
        if (!body.name || !body.company || body.value === undefined) {
            return NextResponse.json({ error: 'Missing required lead data: name, company, and value are required.' }, { status: 400 });
        }

        const leadData = {
            ...body,
            stage: 'newLeads' as const,
        };

        const newLead = await createLead(userId, leadData);
        return NextResponse.json(newLead, { status: 201 });

    } catch (error: any) {
        console.error('Error creating lead:', error);
         if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/session-cookie-revoked') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to create lead', details: error.message }, { status: 500 });
    }
}
