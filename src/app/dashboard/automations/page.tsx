
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Play, Pause, Edit, Trash2, Workflow } from "lucide-react";
import Link from "next/link";
import { automationTemplates, type AutomationTemplate } from "@/lib/automation-templates";
import { nanoid } from "nanoid";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface Automation extends AutomationTemplate {
    instanceId: string;
}

export default function AutomationsPage() {
    const [userAutomations, setUserAutomations] = useState<Automation[]>([]);
    const { toast } = useToast();

    const handleUseTemplate = (template: AutomationTemplate) => {
        const newAutomation: Automation = {
            ...template,
            instanceId: nanoid(),
            title: `${template.title} (Copy)`,
        };
        setUserAutomations(prev => [newAutomation, ...prev]);
        toast({
            title: "Automation Created",
            description: `A new workflow based on "${template.title}" has been added to your list.`,
        });
    };

    const handleDeleteAutomation = (instanceId: string) => {
        setUserAutomations(prev => prev.filter(auto => auto.instanceId !== instanceId));
        toast({
            title: "Automation Deleted",
            description: "The workflow has been removed from your list.",
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Automations</h2>
                    <p className="text-muted-foreground">
                        Create and manage your automated marketing workflows.
                    </p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold tracking-tight mb-4">Your Automations</h3>
                {userAutomations.length === 0 ? (
                     <Card className="flex flex-col items-center justify-center border-dashed min-h-[200px]">
                        <div className="text-center p-6">
                            <Workflow className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Automations Created Yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Get started by using one of the templates below.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {userAutomations.map(automation => (
                            <Card key={automation.instanceId} className="flex flex-col">
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
                                <CardFooter className="mt-auto flex gap-2">
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/dashboard/automations/${automation.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </Button>
                                    <Button variant="destructive-outline" size="icon" onClick={() => handleDeleteAutomation(automation.instanceId)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Separator />

            <div>
                 <h3 className="text-xl font-semibold tracking-tight mb-4">Start from a Template</h3>
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {automationTemplates.map(automation => (
                        <Card key={automation.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{automation.title}</CardTitle>
                                </div>
                                <CardDescription className="h-10 pt-1">{automation.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    <p><strong>Trigger:</strong> {automation.trigger}</p>
                                    <p><strong>Steps:</strong> {automation.steps}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                 <Button className="w-full" onClick={() => handleUseTemplate(automation)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Use Template
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                     <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[300px]">
                        <Button asChild variant="ghost" className="h-full w-full">
                             <Link href="/dashboard/automations/blank" className="flex flex-col items-center justify-center h-full w-full text-center">
                                 <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                                    <Workflow className="h-12 w-12 text-purple-500" />
                                </div>
                                <p className="font-semibold">Start From Scratch</p>
                                <p className="text-sm text-muted-foreground px-4">Build a custom workflow with a blank canvas.</p>
                            </Link>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
