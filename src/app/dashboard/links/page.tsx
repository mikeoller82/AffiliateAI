
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Copy, Edit, Trash2, Link as LinkIcon, BarChart, Users, DollarSign, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AffiliateLink {
    id: number;
    name: string;
    targetUrl: string;
    trackingId: string;
    clicks: number;
    conversions: number;
    commission: number;
    status: 'Active' | 'Archived';
}

export default function LinksPage() {
    const [links, setLinks] = useState<AffiliateLink[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">Affiliate Links</h2>
                    <p className="text-muted-foreground">
                        Manage and analyze your tracking links and campaigns.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Link
                </Button>
            </div>
            
            {links.length === 0 ? (
                <Card className="flex flex-col items-center justify-center border-dashed min-h-[400px]">
                    <div className="text-center">
                        <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Links Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first affiliate link.</p>
                        <Button className="mt-4">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create New Link
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {links.map((link) => {
                        const ctr = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;
                        return (
                            <Card key={link.id}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{link.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 pt-1 text-xs">
                                            <LinkIcon className="h-3 w-3" />
                                            {`https://yourdomain.com/track/${link.trackingId}`}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         <Badge variant={link.status === "Active" ? "outline" : "secondary"} className={link.status === "Active" ? 'border-green-600 bg-green-50 text-green-700 dark:border-green-500/80 dark:bg-green-950 dark:text-green-400' : ''}>
                                            {link.status}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
                                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem><BarChart className="mr-2 h-4 w-4" /> View Analytics</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4">
                                   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex items-center gap-3 rounded-lg border p-3">
                                            <Activity className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Clicks</p>
                                                <p className="text-lg font-bold">{link.clicks.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg border p-3">
                                            <Users className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Conversions</p>
                                                <p className="text-lg font-bold">{link.conversions.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg border p-3">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Commission</p>
                                                <p className="text-lg font-bold">${link.commission.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-lg border p-3">
                                            <BarChart className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">CTR</p>
                                                <p className="text-lg font-bold">{ctr.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
