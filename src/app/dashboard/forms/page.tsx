
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, BarChart3 } from "lucide-react";
import Link from "next/link";
import { formTemplates } from "@/lib/form-templates";

export default function FormsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Forms</h2>
                    <p className="text-muted-foreground">
                        Create and manage your lead capture and survey forms.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/forms/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Form
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {formTemplates.map(form => (
                    <Card key={form.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{form.name}</CardTitle>
                            <CardDescription className="h-10">{form.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-3">
                                <p className="text-2xl font-bold">{form.submissions.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Submissions</p>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-3">
                                <p className="text-2xl font-bold">{form.conversionRate}%</p>
                                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto flex gap-2">
                             <Button variant="outline" className="w-full" asChild>
                                <Link href={`/dashboard/forms/new?template=${form.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                            </Button>
                            <Button variant="secondary" className="w-full">
                                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/forms/new" className="flex flex-col items-center justify-center h-full w-full">
                            <PlusCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Create New Form</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
