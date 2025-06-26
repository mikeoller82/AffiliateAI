
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/components/dashboard/social-scheduler/calendar-view';
import { PostEditor } from '@/components/dashboard/social-scheduler/post-editor';
import { type Post, type SocialProfile } from '@/lib/social-types';
import { useAuth } from '@/contexts/auth-context';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function SocialSchedulerPage() {
    const { user, db } = useAuth();
    const { toast } = useToast();
    const [posts, setPosts] = useState<Post[]>([]);
    const [profiles, setProfiles] = useState<SocialProfile[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    useEffect(() => {
        if (!user || !db) return;

        const postsQuery = query(collection(db, 'users', user.uid, 'social_posts'), orderBy('scheduledTime', 'desc'));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    scheduledTime: (data.scheduledTime as Timestamp).toDate(),
                } as Post;
            });
            setPosts(fetchedPosts);
        });

        const profilesQuery = collection(db, 'users', user.uid, 'connections');
        const unsubscribeProfiles = onSnapshot(profilesQuery, (snapshot) => {
            const fetchedProfiles = snapshot.docs.map(doc => ({
                 id: doc.id, 
                 ...doc.data() 
            }) as SocialProfile);
            setProfiles(fetchedProfiles);
        });

        return () => {
            unsubscribePosts();
            unsubscribeProfiles();
        };
    }, [user, db, toast]);

    const handleConnectTwitter = async () => {
        try {
            const res = await fetch('/api/oauth/twitter/request-token', { method: 'POST' });
            const { authorizationUrl } = await res.json();
            window.location.href = authorizationUrl;
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not connect to Twitter.' });
        }
    };

    // ... (rest of the component is the same)

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">Social Scheduler</h1>
                <p className="text-muted-foreground">Plan and automate your social media content.</p>
                <div className="mt-4">
                    {profiles.length === 0 && (
                        <Button onClick={handleConnectTwitter}>Connect Twitter</Button>
                    )}
                    {profiles.map(profile => (
                        <div key={profile.id} className="flex items-center gap-2">
                            <p>Connected as: {profile.screenName}</p>
                        </div>
                    ))}
                </div>
            </div>
            <CalendarView 
                posts={posts} 
                profiles={profiles}
                onSelectPost={handleSelectPost}
                onAddNewPost={handleCreateNewPost}
            />
            {isEditorOpen && (
                <PostEditor
                    post={selectedPost}
                    profiles={profiles}
                    onSave={handleSavePost}
                    onDelete={handleDeletePost}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </div>
    );
}
