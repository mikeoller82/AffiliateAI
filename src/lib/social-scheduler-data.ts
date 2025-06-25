
import * as Icons from 'lucide-react';
import { addDays, subDays } from 'date-fns';

export interface SocialProfile {
    id: string;
    platform: 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn';
    platformIcon: keyof typeof Icons;
    name: string;
}

export interface Post {
    id: string;
    profileIds: string[];
    caption: string;
    media: { type: 'image' | 'video', url: string }[];
    status: 'draft' | 'scheduled' | 'processing' | 'published' | 'error';
    scheduledTime: Date;
}

export const mockProfiles: SocialProfile[] = [
    { id: 'fb_1', platform: 'Facebook', platformIcon: 'Facebook', name: 'HighLaunchPad Page' },
    { id: 'ig_1', platform: 'Instagram', platformIcon: 'Instagram', name: '@HighLaunchPad' },
    { id: 'tw_1', platform: 'Twitter', platformIcon: 'Twitter', name: '@HighLaunchPad' },
    { id: 'li_1', platform: 'LinkedIn', platformIcon: 'Linkedin', name: 'HighLaunchPad Inc.' },
];

const today = new Date();

export const mockPosts: Post[] = [
    {
        id: 'post_1',
        profileIds: ['fb_1'],
        caption: 'Our new AI Content Engine is a game-changer for marketers. Generate ad copy, emails, and more in seconds. 🚀',
        media: [{ type: 'image', url: 'https://placehold.co/400x400.png' }],
        status: 'published',
        scheduledTime: subDays(today, 2),
    },
    {
        id: 'post_2',
        profileIds: ['ig_1'],
        caption: 'Behind the scenes at HighLaunchPad. #saas #startup #ai',
        media: [{ type: 'video', url: 'https://placehold.co/400x400.png' }],
        status: 'published',
        scheduledTime: subDays(today, 1),
    },
    {
        id: 'post_3',
        profileIds: ['tw_1'],
        caption: 'Quick poll: What feature should we build next? A) Advanced Analytics B) Team Collaboration',
        media: [],
        status: 'scheduled',
        scheduledTime: today,
    },
    {
        id: 'post_4',
        profileIds: ['li_1'],
        caption: 'We\'re excited to announce our seed funding round to accelerate development of our AI-powered CRM for the Creator Economy. Read more on our blog.',
        media: [{ type: 'image', url: 'https://placehold.co/400x400.png' }],
        status: 'scheduled',
        scheduledTime: today,
    },
     {
        id: 'post_5',
        profileIds: ['fb_1', 'ig_1'],
        caption: 'Join our free webinar this Thursday on "How to Triple Your Leads with Marketing Automation". Link in bio to register!',
        media: [{ type: 'image', url: 'https://placehold.co/400x400.png' }],
        status: 'scheduled',
        scheduledTime: addDays(today, 2),
    },
    {
        id: 'post_6',
        profileIds: ['tw_1'],
        caption: 'Draft post about upcoming features.',
        media: [],
        status: 'draft',
        scheduledTime: addDays(today, 3),
    },
];
