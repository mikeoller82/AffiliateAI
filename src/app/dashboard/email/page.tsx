
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ArrowRight, Users, FolderKanban, Settings } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { emailTemplates } from "@/lib/email-templates";

interface Subscriber {
    id: number;
    email: string;
    name: string;
    date: string;
    avatar: string;
}

interface Segment {
    id: number;
    name: string;
    count: number;
}

export default function EmailPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Email Campaign Templates</CardTitle>
                            <CardDescription>Start your next broadcast from a proven template.</CardDescription>
                        </div>
                        <Button asChild variant="outline">
                           <Link href="/dashboard/email/new">
                             <PlusCircle className="mr-2 h-4 w-4" />
                             Start From Scratch
                           </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {emailTemplates.map(template => {
                            const Icon = Icons[template.icon] || Icons.FileText;
                            return (
                                <Card key={template.id}>
                                    <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{template.title}</CardTitle>
                                            <p className="text-xs text-muted-foreground pt-1 h-10">{template.description}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={`/dashboard/email/new?template=${template.id}`}>Use Template</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Contacts</CardTitle>
                        <CardDescription>View your recent subscribers or manage your full contact list.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {subscribers.length === 0 ? (
                             <div className="text-sm text-center text-muted-foreground py-4">No recent subscribers.</div>
                        ) : subscribers.map(sub => (
                             <div className="flex items-center gap-4" key={sub.id}>
                                {/* Avatar Content Removed for brevity */}
                            </div>
                        ))}
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/email/contacts">Manage All Contacts <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FolderKanban className="h-5 w-5"/> Segments</CardTitle>
                        <CardDescription>Group your contacts based on behavior and properties.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {segments.length === 0 ? (
                             <div className="text-sm text-center text-muted-foreground py-4">No segments created.</div>
                        ) : segments.map(seg => (
                            <div key={seg.id} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{seg.name}</span>
                                <span className="text-muted-foreground">{seg.count.toLocaleString()} contacts</span>
                            </div>
                        ))}
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/email/segments">Manage Segments <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5"/> Email Settings</CardTitle>
                        <CardDescription>Configure your sending provider and deliverability options.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                             <Link href="/dashboard/settings?tab=email">Go to Settings <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

    