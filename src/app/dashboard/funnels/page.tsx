import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

const templates = [
    { title: "Lead Magnet Funnel", description: "Capture leads by offering a free ebook or guide.", image: "https://placehold.co/600x400", hint: "ebook download" },
    { title: "Webinar Funnel", description: "Promote your live or automated webinar to engage an audience.", image: "https://placehold.co/600x400", hint: "webinar presentation" },
    { title: "Product Launch Funnel", description: "Build excitement and sell your new product.", image: "https://placehold.co/600x400", hint: "product launch" },
    { title: "Consulting Funnel", description: "Get clients for your consulting or coaching business.", image: "https://placehold.co/600x400", hint: "business meeting" },
];

export default function FunnelsPage() {
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
            <Card>
                <CardHeader>
                    <CardTitle>Start with a Template</CardTitle>
                    <CardDescription>Choose a pre-built funnel template to get started quickly.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {templates.map(template => (
                        <Card key={template.title} className="overflow-hidden">
                            <div className="relative h-40 w-full">
                                <Image src={template.image} alt={template.title} layout="fill" objectFit="cover" data-ai-hint={template.hint} />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <CardDescription className="h-10">{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button className="w-full">Select Template</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
