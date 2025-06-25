
'use client';

import { useState } from 'react';
import { CalendarView } from '@/components/dashboard/social-scheduler/calendar-view';
import { PostEditor } from '@/components/dashboard/social-scheduler/post-editor';
import { type Post, mockPosts } from '@/lib/social-scheduler-data';

export default function SocialSchedulerPage() {
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const handleSelectPost = (post: Post | null) => {
        setSelectedPost(post);
        setIsEditorOpen(true);
    };
    
    const handleSavePost = (postToSave: Post) => {
        if (selectedPost) {
            // Update existing post
            setPosts(posts.map(p => p.id === postToSave.id ? postToSave : p));
        } else {
            // Create new post
            setPosts([...posts, { ...postToSave, id: `post_${Date.now()}` }]);
        }
        setIsEditorOpen(false);
        setSelectedPost(null);
    };
    
    const handleDeletePost = (postId: string) => {
        setPosts(posts.filter(p => p.id !== postId));
        setIsEditorOpen(false);
        setSelectedPost(null);
    }
    
    const handleCreateNewPost = () => {
        setSelectedPost(null);
        setIsEditorOpen(true);
    }

    return (
        <div className="h-full flex flex-col">
            <CalendarView 
                posts={posts} 
                onSelectPost={handleSelectPost}
                onAddNewPost={handleCreateNewPost}
            />
            {isEditorOpen && (
                <PostEditor
                    post={selectedPost}
                    onSave={handleSavePost}
                    onDelete={handleDeletePost}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </div>
    );
}
