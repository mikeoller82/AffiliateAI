
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Lightbulb, Eye, Link as LinkIcon, Users, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const websites = [
    {
        id: "service-business",
        title: "Service Business",
        description: "A professional template for consultants, agencies, or local businesses.",
        image: "https://placehold.co/600x400",
        hint: "business website",
        stats: { visitors: "1.2k", leads: 45, conversion: "3.8%" },
        aiInsight: "Your FAQ section has the highest engagement. Consider turning each question into a blog post."
    },
    {
        id: "portfolio",
        title: "Creator Portfolio",
        description: "Showcase your best work with this clean, modern portfolio template.",
        image: "https://placehold.co/600x400",
        hint: "art portfolio",
        stats: { visitors: "8.9k", leads: 12, conversion: "0.1%" },
        aiInsight: "Add a clear Call-To-Action on each project page to guide visitors to your contact form."
    },
];

export default function WebsitesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Websites</h2>
                    <p className="text-muted-foreground">
                        Create and manage your professional websites.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/websites/default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Website
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {websites.map(website => (
                    <Card key={website.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full">
                            <Image src={website.image} alt={website.title} fill className="object-cover" data-ai-hint={website.hint} />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{website.title}</CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Lightbulb className="h-4 w-4 text-amber-400"/>
                                             </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                            <p className="max-w-xs text-center">{website.aiInsight}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <CardDescription className="h-10 pt-1">{website.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                                <Eye className="h-4 w-4 text-primary" />
                                <span className="font-bold">{website.stats.visitors}</span>
                                <span className="text-muted-foreground">Visitors</span>
                            </div>
                             <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="font-bold">{website.stats.leads}</span>
                                <span className="text-muted-foreground">Leads</span>
                            </div>
                             <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                                <span className="text-lg font-bold">{website.stats.conversion}</span>
                                <span className="text-muted-foreground">Conv. Rate</span>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-4">
                            <Button variant="outline" className="w-full">
                                <LinkIcon className="mr-2 h-4 w-4" /> View Live
                            </Button>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/websites/${website.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Website
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[450px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/websites/default" className="flex flex-col items-center justify-center h-full w-full">
                            <PlusCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Create New Website</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
