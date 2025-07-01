
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, where, serverTimestamp, orderBy, getDoc } from 'firebase/firestore';
import { getAdminApp } from './firebase-admin';
import type { Lead, PipelineStage } from './crm-types';

const getDb = () => getFirestore(getAdminApp());

export async function createLead(userId: string, leadData: Omit<Lead, 'id' | 'createdAt' | 'userId'>): Promise<Lead> {
    const db = getDb();
    const leadsCollection = collection(db, 'leads');
    
    const newLead = {
        ...leadData,
        userId,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(leadsCollection, newLead);
    
    return {
        id: docRef.id,
        ...newLead,
        createdAt: {
            // Firestore timestamps are objects, so we simulate a toDate() method for immediate use
            toDate: () => new Date() 
        }
    } as Lead;
}

export async function getLeads(userId: string): Promise<Lead[]> {
    const db = getDb();
    const leadsCollection = collection(db, 'leads');
    const q = query(leadsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to a serializable format (ISO string) for the API response
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        } as Lead;
    });
}

export async function updateLeadStage(userId: string, leadId: string, newStage: PipelineStage): Promise<void> {
    const db = getDb();
    const leadRef = doc(db, 'leads', leadId);

    const leadDoc = await getDoc(leadRef);
    if (!leadDoc.exists() || leadDoc.data().userId !== userId) {
        throw new Error('Lead not found or permission denied.');
    }

    await updateDoc(leadRef, {
        stage: newStage,
    });
}
