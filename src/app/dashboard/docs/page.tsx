'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BookOpen, FileText } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { docTemplates, type DocTemplate } from "@/lib/docs-templates";
import { nanoid } from 'nanoid';
import { Separator } from '@/components/ui/separator';

interface UserDoc extends DocTemplate {
    instanceId: string;
}

export default function DocsPage() {
    const [userDocs, setUserDocs] = useState<UserDoc[]>([]);

    const handleCreateDoc = (template: DocTemplate) => {
        const newDoc: UserDoc = {
            ...template,
            instanceId: nanoid(),
            title: `${template.title} (Copy)`
        };
        setUserDocs(prev => [newDoc, ...prev]);
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Documents</h2>
                    <p className="text-muted-foreground">
                        Create and manage your internal documentation and knowledge base.
                    </p>
                </div>
            </div>
            
             <div>
                <h3 className="text-xl font-semibold tracking-tight mb-4">Your Documents</h3>
                {userDocs.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-dashed min-h-[200px]">
                        <div className="text-center p-6">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Documents Created Yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Get started by using one of the templates below.</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {userDocs.map(doc => {
                            const Icon = Icons[doc.icon as keyof typeof Icons] || Icons.FileText;
                            return (
                                <Card key={doc.instanceId} className="flex flex-col">
                                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                                        <div className="p-2 bg-muted rounded-lg">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle>{doc.title}</CardTitle>
                                            <p className="text-xs text-muted-foreground pt-1">{doc.category}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <Button asChild className="w-full" variant="outline">
                                            <Link href={`/dashboard/docs/${doc.id}`}>
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Read Doc
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            <Separator />

            <div>
                <h3 className="text-xl font-semibold tracking-tight mb-4">Start from a Template</h3>
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {docTemplates.map(doc => {
                        const Icon = Icons[doc.icon as keyof typeof Icons] || Icons.FileText;
                        return (
                            <Card key={doc.id} className="flex flex-col">
                                <CardHeader className="flex-row items-start gap-4 space-y-0">
                                    <div className="p-2 bg-muted rounded-lg">
                                    <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle>{doc.title}</CardTitle>
                                        <p className="text-xs text-muted-foreground pt-1">{doc.category}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={() => handleCreateDoc(doc)}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Use Template
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
