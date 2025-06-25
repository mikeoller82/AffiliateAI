
'use client';
import { Button } from '@/components/ui/button';
import { type Post, type SocialProfile } from '@/lib/social-types';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

interface PostCardProps {
  post: Post;
  profiles: SocialProfile[];
  onClick: () => void;
}

const statusColors = {
  draft: 'bg-gray-500',
  scheduled: 'bg-blue-500',
  processing: 'bg-yellow-500',
  published: 'bg-green-500',
  error: 'bg-red-500',
};

export function PostCard({ post, profiles, onClick }: PostCardProps) {
  const profile = profiles.find(p => p.id === post.profileIds[0]);
  const PlatformIcon = profile ? Icons[profile.platformIcon as keyof typeof Icons] : Icons.HelpCircle;

  return (
    <Button 
      variant="ghost" 
      className="w-full h-auto p-1.5 flex items-center justify-start gap-2 text-left bg-muted/50 hover:bg-muted"
      onClick={onClick}
    >
      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", statusColors[post.status])} />
      <PlatformIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <p className="text-xs truncate flex-1">{post.caption || 'No caption'}</p>
    </Button>
  );
}
