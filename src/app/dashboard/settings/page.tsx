
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building, Mail, Globe, Key, CreditCard, Users, Trash2, MoreHorizontal } from 'lucide-react';

function SettingsPageComponent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const defaultTab = searchParams.get('tab') || 'profile';

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your changes have been successfully saved.",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account, workspace, and integration settings.
                </p>
            </div>
            <Tabs defaultValue={defaultTab} className="flex flex-col md:flex-row gap-6">
                <TabsList className="flex flex-col h-full bg-transparent p-0 border-r w-full md:w-48">
                    <TabsTrigger value="profile" className="w-full justify-start gap-2"><User />Profile</TabsTrigger>
                    <TabsTrigger value="workspace" className="w-full justify-start gap-2"><Building />Workspace</TabsTrigger>
                    <TabsTrigger value="email" className="w-full justify-start gap-2"><Mail />Email</TabsTrigger>
                    <TabsTrigger value="domains" className="w-full justify-start gap-2"><Globe />Domains</TabsTrigger>
                    <TabsTrigger value="api" className="w-full justify-start gap-2"><Key />API Keys</TabsTrigger>
                    <TabsTrigger value="billing" className="w-full justify-start gap-2"><CreditCard />Billing</TabsTrigger>
                    <TabsTrigger value="team" className="w-full justify-start gap-2"><Users />Team</TabsTrigger>
                </TabsList>
                <div className="flex-1">
                    <TabsContent value="profile" className="mt-0">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information and photo.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src="https://placehold.co/80x80" data-ai-hint="profile picture" />
                                            <AvatarFallback>DU</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline">Upload Photo</Button>
                                    </div>
                                    <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" defaultValue="Demo User" /></div>
                                    <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" defaultValue="user@example.com" disabled /></div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>Update your password. It's a good idea to use a strong, unique password.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2"><Label htmlFor="current-password">Current Password</Label><Input id="current-password" type="password" /></div>
                                    <div className="space-y-2"><Label htmlFor="new-password">New Password</Label><Input id="new-password" type="password" /></div>
                                    <div className="space-y-2"><Label htmlFor="confirm-password">Confirm New Password</Label><Input id="confirm-password" type="password" /></div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="workspace" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>Workspace</CardTitle><CardDescription>Manage your workspace name and general settings.</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="workspace-name">Workspace Name</Label><Input id="workspace-name" defaultValue="Demo Workspace" /></div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="email" className="mt-0">
                        <div className="space-y-6">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Sending Provider (SMTP)</CardTitle>
                                    <CardDescription>Connect to a service to send your emails. We recommend Amazon SES for deliverability.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="provider">Provider</Label>
                                        <Select defaultValue="ses">
                                            <SelectTrigger id="provider"><SelectValue placeholder="Select a provider" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ses">Amazon SES</SelectItem>
                                                <SelectItem value="sendgrid">SendGrid</SelectItem>
                                                <SelectItem value="mailgun">Mailgun</SelectItem>
                                                <SelectItem value="postmark">Postmark</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div className="space-y-2"><Label htmlFor="api-key">API Key</Label><Input id="api-key" type="password" placeholder="••••••••••••••••••••••••" /></div>
                                     <div className="space-y-2"><Label htmlFor="region">AWS Region (if using SES)</Label><Input id="region" placeholder="e.g., us-east-1" /></div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader><CardTitle>Sending Defaults</CardTitle><CardDescription>Default settings for all outgoing campaigns.</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-2"><Label htmlFor="from-name">"From" Name</Label><Input id="from-name" placeholder="Your Company Name" /></div>
                                     <div className="space-y-2"><Label htmlFor="from-email">"From" Email Address</Label><Input id="from-email" type="email" placeholder="hello@yourdomain.com" /></div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="domains" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>Custom Domains</CardTitle><CardDescription>Manage domains for your funnels and websites.</CardDescription></CardHeader>
                            <CardContent>
                                {/* Domain list would go here */}
                                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                                    <p>You haven't added any custom domains yet.</p>
                                    <Button variant="outline" className="mt-4">Add Domain</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="api" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>API Keys</CardTitle><CardDescription>Manage API keys to integrate with external services.</CardDescription></CardHeader>
                            <CardContent>
                                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                                    <p>API access is not enabled on your plan.</p>
                                    <Button variant="outline" className="mt-4" disabled>Generate API Key</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="billing" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>Billing</CardTitle><CardDescription>Manage your subscription, view invoices, and update payment details.</CardDescription></CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-semibold">Pro Plan</h4>
                                        <p className="text-muted-foreground text-sm">Renews on July 1, 2025</p>
                                    </div>
                                    <Button>Manage Subscription</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="team" className="mt-0">
                         <Card>
                            <CardHeader><CardTitle>Team Management</CardTitle><CardDescription>Invite and manage team members for your workspace.</CardDescription></CardHeader>
                            <CardContent>
                                <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                                    <p>You are the only member of this workspace.</p>
                                    <Button variant="outline" className="mt-4">Invite Team Member</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <div className="flex justify-end mt-6">
                        <Button onClick={handleSave}>Save All Changes</Button>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}


export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SettingsPageComponent />
        </Suspense>
    )
}
