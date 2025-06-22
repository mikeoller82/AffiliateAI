
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, Users, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

const segments = [
    { id: 1, name: "Active Subscribers", description: "Contacts who opened an email in the last 30 days.", count: 18450 },
    { id: 2, name: "New Leads", description: "Contacts added in the last 30 days with the 'Lead' tag.", count: 215 },
    { id: 3, name: "High-Value Customers", description: "Contacts with the 'VIP' tag.", count: 430 },
    { id: 4, name: "Inactive Contacts", description: "Contacts who have not engaged in 90 days.", count: 1240 },
];


export default function SegmentsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Segments</h2>
                    <p className="text-muted-foreground">
                        Create dynamic groups of contacts based on rules and filters.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Segment
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {segments.map(segment => (
                    <Card key={segment.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{segment.name}</CardTitle>
                            <CardDescription className="h-10">{segment.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-2xl font-bold">
                                <Users className="h-6 w-6 text-muted-foreground"/>
                                {segment.count.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">Contacts in segment</p>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <Button variant="outline" className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                View & Edit Rules
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
