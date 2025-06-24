
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, BarChart, Send, Trash2, Users, FolderKanban, Settings, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
    id: number;
    name: string;
    status: 'Active' | 'Sent' | 'Draft';
    sent: number;
    openRate: string;
    clickRate: string;
}

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
    const { toast } = useToast();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [segments, setSegments] = useState<Segment[]>([]);

    const handleDeleteCampaign = (id: number) => {
        setCampaigns(campaigns.filter(c => c.id !== id));
        toast({
            title: "Campaign Deleted",
            description: "The email campaign has been successfully deleted.",
        });
    };

    const handleAction = (action: string) => {
        toast({
            title: "Action Triggered",
            description: `The "${action}" action is not yet implemented.`,
        });
    };
    
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Email Campaigns</CardTitle>
                            <CardDescription>Manage your email sequences and broadcasts.</CardDescription>
                        </div>
                        <Button asChild>
                           <Link href="/dashboard/email/new">
                             <PlusCircle className="mr-2 h-4 w-4" />
                             New Campaign
                           </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Open Rate</TableHead>
                                    <TableHead className="text-right">Click Rate</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No campaigns found.
                                        </TableCell>
                                    </TableRow>
                                ) : campaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">{campaign.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>{campaign.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{campaign.openRate}</TableCell>
                                        <TableCell className="text-right">{campaign.clickRate}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href="/dashboard/email/new"><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction('View Stats')}><BarChart className="mr-2 h-4 w-4" /> View Stats</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction('Send')}><Send className="mr-2 h-4 w-4" /> Send</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCampaign(campaign.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
                                <Avatar>
                                    <AvatarImage src={sub.avatar} data-ai-hint="profile avatar"/>
                                    <AvatarFallback>{sub.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-none">{sub.name}</p>
                                    <p className="text-sm text-muted-foreground">{sub.email}</p>
                                </div>
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
