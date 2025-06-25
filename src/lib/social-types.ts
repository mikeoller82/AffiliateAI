
import type * as Icons from 'lucide-react';

export interface SocialProfile {
    id: string; // Corresponds to document ID in Firestore
    platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn';
    platformIcon: keyof typeof Icons;
    name: string;
    // In a real scenario, this would hold encrypted tokens
    credentials?: any; 
}

export interface Post {
    id: string; // Corresponds to document ID in Firestore
    profileIds: string[];
    caption: string;
    media: { type: 'image' | 'video', url: string }[];
    status: 'draft' | 'scheduled' | 'processing' | 'published' | 'error';
    scheduledTime: any; // Firestore Timestamp will be used here, but Date object on client
}
