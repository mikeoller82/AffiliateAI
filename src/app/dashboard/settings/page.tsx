
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
import { User, Building, Mail, Globe, Key, CreditCard, Users, Share2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { BillingForm } from '@/components/dashboard/billing-form';

const socialPlatforms = [
    { name: 'Facebook', icon: Facebook, color: 'text-[#1877F2]' },
    { name: 'Instagram', icon: Instagram, color: 'text-[#E4405F]' },
    { name: 'Twitter', icon: Twitter, color: 'text-[#1DA1F2]' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-[#0A66C2]' },
];

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
    
    const handleConnect = (platformName: string) => {
        toast({
            title: `Connecting to ${platformName}`,
            description: 'This functionality is not yet implemented. This is where the OAuth flow would begin.',
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
                    <TabsTrigger value="billing" className="w-full justify-start gap-2"><CreditCard />Billing</TabsTrigger>
                    <TabsTrigger value="email" className="w-full justify-start gap-2"><Mail />Email</TabsTrigger>
                    <TabsTrigger value="domains" className="w-full justify-start gap-2"><Globe />Domains</TabsTrigger>
                    <TabsTrigger value="social" className="w-full justify-start gap-2"><Share2 />Social Accounts</TabsTrigger>
                    <TabsTrigger value="api" className="w-full justify-start gap-2"><Key />API Keys</TabsTrigger>
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
                                            <AvatarImage src="https://placehold.co/80x80.png" data-ai-hint="profile picture" />
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
                    <TabsContent value="billing" className="mt-0">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Subscription</CardTitle>
                                <CardDescription>View your current plan, update payment details, and view billing history.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BillingForm />
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
                    <TabsContent value="social" className="mt-0">
                         <Card>
                            <CardHeader>
                                <CardTitle>Connect Social Accounts</CardTitle>
                                <CardDescription>Connect your social media profiles to start scheduling posts.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {socialPlatforms.map((platform) => {
                                    const Icon = platform.icon;
                                    return (
                                        <div key={platform.name} className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn("h-6 w-6", platform.color)} />
                                                <span className="font-medium">{platform.name}</span>
                                            </div>
                                            <Button variant="outline" onClick={() => handleConnect(platform.name)}>Connect</Button>
                                        </div>
                                    )
                                })}
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

    