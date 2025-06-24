
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, BookOpen } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { docTemplates, type DocTemplate } from "@/lib/docs-templates";

export default function DocsPage() {
    const [docs, setDocs] = useState<DocTemplate[]>([]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Documents</h2>
                    <p className="text-muted-foreground">
                        Create and manage your internal documentation and wikis.
                    </p>
                </div>
                <div className="relative flex-1 sm:flex-initial">
                     <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> New Doc
                    </Button>
                </div>
            </div>
            
             {docs.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {docs.map(doc => {
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
                                    <Button asChild className="w-full" variant="outline">
                                        <Link href={`/dashboard/docs/${doc.id}`}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Use Template
                                        </Link>
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
