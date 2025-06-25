
'use client';

import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { PostCard } from './post-card';
import { type Post, type SocialProfile } from '@/lib/social-types';
import { format } from 'date-fns';

interface CalendarViewProps {
  posts: Post[];
  profiles: SocialProfile[];
  onSelectPost: (post: Post) => void;
  onAddNewPost: () => void;
}

function CustomDay({ date, displayMonth, posts, profiles, onSelectPost }: { date: Date; displayMonth: Date, posts: Post[], profiles: SocialProfile[], onSelectPost: (post: Post) => void }) {
  const postsForDay = posts.filter(p => format(new Date(p.scheduledTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

  return (
    <Card className="h-40 flex flex-col rounded-md overflow-hidden">
      <div className="p-1 text-right text-sm">{format(date, 'd')}</div>
      <CardContent className="p-1 flex-1 overflow-y-auto space-y-1">
        {postsForDay.map(post => (
          <PostCard key={post.id} post={post} profiles={profiles} onClick={() => onSelectPost(post)} />
        ))}
      </CardContent>
    </Card>
  );
}

export function CalendarView({ posts, profiles, onSelectPost, onAddNewPost }: CalendarViewProps) {
  const [month, setMonth] = useState<Date>(new Date());
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setMonth(prev => new Date(prev.setMonth(prev.getMonth() - 1)))}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold w-32 text-center">{format(month, 'MMMM yyyy')}</h2>
            <Button variant="outline" size="icon" onClick={() => setMonth(prev => new Date(prev.setMonth(prev.getMonth() + 1)))}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
        <Button onClick={onAddNewPost}>
          <PlusCircle className="mr-2 h-4 w-4"/>
          Create Post
        </Button>
      </div>
      <div className="flex-1">
        <DayPicker
          month={month}
          onMonthChange={setMonth}
          mode="single"
          className="w-full h-full"
          classNames={{
            root: 'h-full flex flex-col',
            months: 'flex-1',
            month: 'h-full flex flex-col',
            table: 'h-full w-full border-collapse',
            tbody: 'h-full grid grid-rows-5',
            head_row: 'grid grid-cols-7',
            row: 'grid grid-cols-7 border-t h-full',
            cell: 'border-l align-top text-sm',
            day: 'h-full w-full',
          }}
          components={{
            Day: (props) => <CustomDay {...props} posts={posts} profiles={profiles} onSelectPost={onSelectPost} />,
            IconLeft: () => null,
            IconRight: () => null,
            Caption: () => null,
          }}
        />
      </div>
    </div>
  );
}
