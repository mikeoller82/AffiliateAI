
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Play, Pause, Edit, Trash2, Workflow } from "lucide-react";
import Link from "next/link";
import type { AutomationTemplate } from "@/lib/automation-templates";

export default function AutomationsPage() {
    const [automations, setAutomations] = useState<AutomationTemplate[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Automations</h2>
                    <p className="text-muted-foreground">
                        Create and manage your automated marketing workflows.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/automations/blank">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Automation
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {automations.map(automation => (
                    <Card key={automation.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{automation.title}</CardTitle>
                                <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                                    {automation.status === 'active' ? <Play className="mr-1.5 h-3 w-3" /> : <Pause className="mr-1.5 h-3 w-3" />}
                                    {automation.status}
                                </Badge>
                            </div>
                            <CardDescription className="h-10 pt-1">{automation.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                <p><strong>Trigger:</strong> {automation.trigger}</p>
                                <p><strong>Steps:</strong> {automation.steps}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto flex flex-col sm:flex-row gap-2">
                             <Button variant="outline" className="w-full" asChild>
                                <Link href={`/dashboard/automations/${automation.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[300px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/automations/welcome-sequence" className="flex flex-col items-center justify-center h-full w-full text-center">
                             <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                                <Workflow className="h-12 w-12 text-purple-500" />
                            </div>
                            <p className="font-semibold">Create New Automation</p>
                            <p className="text-sm text-muted-foreground px-4">Start with a blank canvas or use a proven template.</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
