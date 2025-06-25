
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { type Post, mockProfiles } from '@/lib/social-scheduler-data';
import { Calendar as CalendarIcon, Smile, Image as ImageIcon, Video, Trash2, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

interface PostEditorProps {
  post: Post | null;
  onSave: (post: Post) => void;
  onDelete: (postId: string) => void;
  onClose: () => void;
}

export function PostEditor({ post, onSave, onDelete, onClose }: PostEditorProps) {
  const [caption, setCaption] = useState('');
  const [scheduledTime, setScheduledTime] = useState<Date | undefined>(new Date());
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setCaption(post.caption);
      setScheduledTime(post.scheduledTime);
      setSelectedProfiles(post.profileIds);
    } else {
      setCaption('');
      setScheduledTime(new Date());
      setSelectedProfiles([]);
    }
  }, [post]);

  const handleSave = () => {
    const newPostData: Post = {
      id: post?.id || '',
      profileIds: selectedProfiles,
      caption,
      scheduledTime: scheduledTime || new Date(),
      status: 'scheduled',
      media: post?.media || [],
    };
    onSave(newPostData);
  };
  
  const handleProfileSelect = (profileId: string) => {
      setSelectedProfiles(prev => 
        prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
      );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl grid-cols-3">
        <div className="col-span-2 space-y-4">
            <DialogHeader>
                <DialogTitle>{post ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-2">
                <Label>Publish to</Label>
                <div className="flex flex-wrap gap-2">
                    {mockProfiles.map(profile => {
                        const PlatformIcon = Icons[profile.platformIcon as keyof typeof Icons] || Icons.HelpCircle;
                        return (
                             <div key={profile.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`profile-${profile.id}`} 
                                    checked={selectedProfiles.includes(profile.id)}
                                    onCheckedChange={() => handleProfileSelect(profile.id)}
                                />
                                <label htmlFor={`profile-${profile.id}`} className="text-sm font-medium leading-none flex items-center gap-2">
                                    <PlatformIcon className="h-4 w-4"/> {profile.name}
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="caption">Caption ({caption.length}/2200)</Label>
                <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="min-h-[200px]"
                    placeholder="What's on your mind?"
                />
            </div>
            
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon"><ImageIcon className="h-4 w-4"/></Button>
                 <Button variant="outline" size="icon"><Video className="h-4 w-4"/></Button>
                 <Button variant="outline" size="icon"><Smile className="h-4 w-4"/></Button>
            </div>
        </div>

        <div className="col-span-1 bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Scheduling</h3>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduledTime ? format(scheduledTime, 'PPP') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={scheduledTime} onSelect={setScheduledTime} initialFocus />
                </PopoverContent>
            </Popover>
            <Input type="time" value={scheduledTime ? format(scheduledTime, 'HH:mm') : ''} onChange={(e) => {
                const [hours, minutes] = e.target.value.split(':');
                const newDate = new Date(scheduledTime || new Date());
                newDate.setHours(parseInt(hours, 10));
                newDate.setMinutes(parseInt(minutes, 10));
                setScheduledTime(newDate);
            }}/>
            <DialogFooter className="!justify-between pt-4 border-t">
                {post && (
                    <Button variant="destructive" onClick={() => onDelete(post.id)}><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
                )}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Schedule</Button>
                </div>
            </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
