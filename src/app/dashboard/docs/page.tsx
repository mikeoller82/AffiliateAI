
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit } from "lucide-react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { docTemplates } from "@/lib/docs-templates";

export default function DocsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Documentation & Wiki</h2>
                    <p className="text-muted-foreground">
                        Find guides, tutorials, and best practices for using the platform.
                    </p>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search docs..." className="w-full pl-9" />
                    </div>
                     <Button asChild>
                        <Link href="/dashboard/docs/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Doc
                        </Link>
                    </Button>
                </div>
            </div>
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
                                        <Edit className="mr-2 h-4 w-4" />
                                        Read & Edit
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[250px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/docs/new" className="flex flex-col items-center justify-center h-full w-full">
                            <PlusCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Create New Document</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
