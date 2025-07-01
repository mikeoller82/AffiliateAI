
export type PipelineStage = 'newLeads' | 'contacted' | 'proposalSent' | 'won';

export interface Lead {
    id: string; // Firestore document ID
    name: string;
    email?: string;
    value: number;
    tags: string[];
    company: string;
    score: number;
    stage: PipelineStage;
    createdAt: any; // Firestore Timestamp
    userId: string; // ID of the user who owns this lead
}
