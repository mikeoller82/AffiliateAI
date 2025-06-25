
'use client';

import { useState, useEffect } from 'react';
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
        }, (error) => {
            console.error("Error fetching posts:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch posts.' });
        });

        const profilesQuery = collection(db, 'users', user.uid, 'social_profiles');
        const unsubscribeProfiles = onSnapshot(profilesQuery, (snapshot) => {
            const fetchedProfiles = snapshot.docs.map(doc => doc.data() as SocialProfile);
            setProfiles(fetchedProfiles);
        }, (error) => {
            console.error("Error fetching profiles:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch social profiles.' });
        });

        return () => {
            unsubscribePosts();
            unsubscribeProfiles();
        };
    }, [user, db, toast]);

    const handleSelectPost = (post: Post) => {
        setSelectedPost(post);
        setIsEditorOpen(true);
    };
    
    const handleSavePost = async (postToSave: Omit<Post, 'id' | 'scheduledTime'> & { id?: string; scheduledTime: Date }) => {
        if (!user || !db) {
            toast({ variant: 'destructive', title: 'Error', description: 'Not authenticated.' });
            return;
        }

        const { id, ...postData } = postToSave;
        const postPayload = {
            ...postData,
            scheduledTime: Timestamp.fromDate(postToSave.scheduledTime),
        };

        try {
            if (id) {
                const postRef = doc(db, 'users', user.uid, 'social_posts', id);
                await updateDoc(postRef, postPayload);
                toast({ title: 'Post Updated', description: 'Your post has been saved.' });
            } else {
                await addDoc(collection(db, 'users', user.uid, 'social_posts'), postPayload);
                toast({ title: 'Post Created', description: 'Your post has been scheduled.' });
            }
            setIsEditorOpen(false);
            setSelectedPost(null);
        } catch (error) {
            console.error("Error saving post:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save post.' });
        }
    };
    
    const handleDeletePost = async (postId: string) => {
        if (!user || !db) return;
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'social_posts', postId));
            toast({ title: 'Post Deleted', description: 'The post has been removed.' });
            setIsEditorOpen(false);
            setSelectedPost(null);
        } catch (error) {
            console.error("Error deleting post:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete post.' });
        }
    };
    
    const handleCreateNewPost = () => {
        setSelectedPost(null);
        setIsEditorOpen(true);
    };

    return (
        <div className="h-full flex flex-col">
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
