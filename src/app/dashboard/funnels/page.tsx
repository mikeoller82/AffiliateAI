
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Lightbulb, TrendingUp, UserPlus, HeartPulse, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Funnel {
    id: string;
    title: string;
    description: string;
    image: string;
    hint: string;
    stats: { ctr: number; optInRate: number; healthScore: number };
    aiInsight: string;
}

export default function FunnelsPage() {
    const [funnels, setFunnels] = useState<Funnel[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Funnels</h2>
                    <p className="text-muted-foreground">
                        Create and manage your marketing funnels.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Funnel
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {funnels.map(funnel => (
                    <Card key={funnel.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full">
                            <Image src={funnel.image} alt={funnel.title} fill className="object-cover" data-ai-hint={funnel.hint} />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{funnel.title}</CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Badge variant={funnel.stats.healthScore > 80 ? "default" : "secondary"}>
                                                <HeartPulse className="mr-1.5 h-3 w-3" />
                                                {funnel.stats.healthScore}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>AI Funnel Health Score</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <CardDescription className="h-10 pt-1">{funnel.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-lg font-bold">{funnel.stats.ctr}%</p>
                                    <p className="text-xs text-muted-foreground">CTR</p>
                                </div>
                            </div>
                             <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
                                <UserPlus className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-lg font-bold">{funnel.stats.optInRate}%</p>
                                    <p className="text-xs text-muted-foreground">Opt-in Rate</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-2">
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Lightbulb className="mr-2 h-4 w-4" /> AI Insights
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent align="start">
                                        <p className="max-w-xs">{funnel.aiInsight}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/funnels/${funnel.id}`}>Edit Funnel</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[480px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/funnels/lead-magnet-funnel" className="flex flex-col items-center justify-center h-full w-full text-center">
                            <div className="p-4 bg-secondary/10 rounded-full mb-4">
                                <Filter className="h-12 w-12 text-secondary" />
                            </div>
                            <p className="font-semibold">Create New Funnel</p>
                            <p className="text-sm text-muted-foreground px-4">Start with a template to capture leads, sell products, or host webinars.</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
