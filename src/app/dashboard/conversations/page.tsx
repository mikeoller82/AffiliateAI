
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare, Send, Phone, Search, Twitter, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- Data Structures ---
type Channel = 'email' | 'sms' | 'instagram' | 'twitter';

interface Conversation {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  channel: Channel;
  avatar: string;
  avatarHint: string;
  tags: string[];
}

interface Message {
  from: 'me' | 'other';
  text: string;
  time: string;
}

// --- Mock Data ---
const mockConversations: Conversation[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567', lastMessage: 'Hey, I had a question about my order...', time: '10:42 AM', unread: 2, channel: 'email', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait', tags: ['Hot Lead', 'Funnel: AI Playbook'] },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 (555) 234-5678', lastMessage: 'Can you send me the link again?', time: '9:15 AM', unread: 0, channel: 'sms', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait', tags: ['Customer', 'Pro Plan'] },
  { id: 3, name: 'Alex Johnson', email: 'alex.j@example.com', phone: '+1 (555) 345-6789', lastMessage: 'Thanks for the quick reply!', time: 'Yesterday', unread: 0, channel: 'instagram', avatar: 'https://placehold.co/40x40.png', avatarHint: 'person glasses', tags: ['Follow-up'] },
  { id: 4, name: 'Support Bot', email: 'bot@highlaunchpad.com', phone: 'N/A', lastMessage: 'A new lead from the contact form.', time: 'Yesterday', unread: 0, channel: 'email', avatar: 'https://placehold.co/40x40.png', avatarHint: 'robot face', tags: ['Internal', 'New Lead'] },
];

const messagesByConversationId: Record<number, Message[]> = {
  1: [
    { from: 'other', text: 'Hey, I had a question about my order...', time: '10:38 AM' },
    { from: 'me', text: 'Of course, what\'s your order number?', time: '10:40 AM' },
    { from: 'other', text: 'It\'s #12345. I haven\'t received a shipping notification yet.', time: '10:42 AM' },
  ],
  2: [
    { from: 'other', text: 'Can you send me the link again?', time: '9:15 AM' },
  ],
  3: [
    { from: 'me', text: 'Following up on our conversation from last week.', time: 'Yesterday' },
    { from: 'other', text: 'Thanks for the quick reply!', time: 'Yesterday' },
  ],
  4: [
      { from: 'other', text: 'A new lead from the contact form: Mike Oller, mike@example.com', time: 'Yesterday' }
  ]
};

const channelIcons: Record<Channel, React.ReactElement> = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    instagram: <Instagram className="h-4 w-4" />,
    twitter: <Twitter className="h-4 w-4" />,
};

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const messages = selectedConversation ? messagesByConversationId[selectedConversation.id] || [] : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr_320px] h-[calc(100vh-4rem)] border-t">
      {/* Sidebar with conversation list */}
      <aside className="border-r flex flex-col bg-card">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold tracking-tight">Conversations</h2>
           <div className="relative mt-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="w-full pl-8" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map(conv => (
            <div
              key={conv.id}
              className={cn(
                  'p-3 border-b cursor-pointer hover:bg-muted/50 flex gap-3 items-start',
                  selectedConversation?.id === conv.id ? 'bg-muted' : ''
              )}
              onClick={() => setSelectedConversation(conv)}
            >
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={conv.avatar} data-ai-hint={conv.avatarHint} />
                <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{conv.time}</p>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                <div className="flex justify-between items-center mt-1">
                    <div className="text-muted-foreground">{channelIcons[conv.channel]}</div>
                    {conv.unread > 0 && (
                        <Badge variant="default" className="h-5 px-1.5 text-xs">{conv.unread}</Badge>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main conversation view */}
      <main className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            <header className="p-3 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={selectedConversation.avatar} data-ai-hint={selectedConversation.avatarHint} />
                <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedConversation.name}</h3>
              </div>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 items-end ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                   {msg.from === 'other' && <Avatar className="h-8 w-8"><AvatarImage src={selectedConversation.avatar} data-ai-hint={selectedConversation.avatarHint} /></Avatar>}
                  <div className={`p-3 rounded-lg max-w-lg ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <footer className="p-4 border-t bg-card">
              <div className="relative">
                <Textarea placeholder="Type your message..." className="pr-24" rows={1} />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Phone className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Mail className="h-16 w-16" />
            <h3 className="mt-4 text-lg font-semibold">Select a conversation</h3>
            <p>Your unified inbox for email, SMS, and social DMs will appear here.</p>
          </div>
        )}
      </main>
      
       {/* Right sidebar with contact details */}
       <aside className="hidden lg:block border-l bg-card p-4">
           {selectedConversation ? (
               <div className="space-y-4">
                    <CardHeader className="p-0 items-center text-center">
                        <Avatar className="h-20 w-20 border">
                            <AvatarImage src={selectedConversation.avatar} data-ai-hint={selectedConversation.avatarHint} />
                            <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="pt-2">{selectedConversation.name}</CardTitle>
                        <CardDescription>Lead</CardDescription>
                    </CardHeader>
                    <Separator/>
                     <div>
                        <h4 className="text-sm font-semibold mb-2">Contact Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Email: {selectedConversation.email}</p>
                            <p>Phone: {selectedConversation.phone}</p>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                            {selectedConversation.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
               </div>
           ) : (
               <div className="text-center text-sm text-muted-foreground pt-20">Select a conversation to see contact details.</div>
           )}
       </aside>
    </div>
  );
}
