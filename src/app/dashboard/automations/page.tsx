
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Play, Pause, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const automations = [
    {
        id: "1",
        title: "New Lead Welcome Sequence",
        description: "Sends a welcome email and tags new leads.",
        status: "active",
        trigger: "Form Submitted",
        steps: 4,
    },
    {
        id: "2",
        title: "Webinar Reminder Flow",
        description: "Reminds registrants about the upcoming webinar.",
        status: "active",
        trigger: "Tag Added",
        steps: 3,
    },
    {
        id: "3",
        title: "Post-Purchase Upsell",
        description: "Offers a related product after a purchase.",
        status: "paused",
        trigger: "Product Purchased",
        steps: 5,
    },
];

export default function AutomationsPage() {
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
                    <Link href="/dashboard/automations/new">
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
                                <Link href="/dashboard/automations/new">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Link>
                            </Button>
                            <Button variant="destructive" className="w-full">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/automations/new" className="flex flex-col items-center justify-center h-full w-full">
                            <PlusCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Create New Automation</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
