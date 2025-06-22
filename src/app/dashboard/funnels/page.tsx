
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Lightbulb, TrendingUp, UserPlus, HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const funnels = [
    {
        id: "lead-magnet-funnel",
        title: "Lead Magnet Funnel",
        description: "Capture leads by offering a free ebook or guide.",
        image: "https://placehold.co/600x400",
        hint: "ebook download",
        stats: { ctr: 12.5, optInRate: 28.3, healthScore: 88 },
        aiInsight: "Excellent opt-in rate! To improve further, A/B test the headline on your landing page."
    },
    {
        id: "webinar-funnel",
        title: "Webinar Funnel",
        description: "Promote your live or automated webinar to engage an audience.",
        image: "https://placehold.co/600x400",
        hint: "webinar presentation",
        stats: { ctr: 8.2, optInRate: 19.1, healthScore: 76 },
        aiInsight: "The show-up rate can be improved. Send an SMS reminder 1 hour before the webinar starts."
    },
    {
        id: "product-launch-funnel",
        title: "Product Launch Funnel",
        description: "Build excitement and sell your new product.",
        image: "https://placehold.co/600x400",
        hint: "product launch",
        stats: { ctr: 6.7, optInRate: 15.4, healthScore: 65 },
        aiInsight: "The drop-off rate on the checkout page is high. Consider adding a satisfaction guarantee badge."
    },
    {
        id: "consulting-funnel",
        title: "Consulting Funnel",
        description: "Get clients for your consulting or coaching business.",
        image: "https://placehold.co/600x400",
        hint: "business meeting",
        stats: { ctr: 9.9, optInRate: 21.2, healthScore: 82 },
        aiInsight: "Strong performance. To optimize, add video testimonials to the booking page to increase trust."
    },
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {funnels.map(funnel => (
                    <Card key={funnel.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full">
                            <Image src={funnel.image} alt={funnel.title} fill className="object-cover" data-ai-hint={funnel.hint} />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{funnel.title}</CardTitle>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Badge variant={funnel.stats.healthScore > 80 ? "default" : "secondary"}>
                                                <HeartPulse className="mr-1.5 h-3 w-3" />
                                                {funnel.stats.healthScore}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>AI Funnel Health Score</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <CardDescription className="h-10 pt-1">{funnel.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-lg font-bold">{funnel.stats.ctr}%</p>
                                    <p className="text-xs text-muted-foreground">CTR</p>
                                </div>
                            </div>
                             <div className="flex items-center justify-center gap-2 rounded-lg border p-3">
                                <UserPlus className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-lg font-bold">{funnel.stats.optInRate}%</p>
                                    <p className="text-xs text-muted-foreground">Opt-in Rate</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-2">
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Lightbulb className="mr-2 h-4 w-4" /> AI Insights
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent align="start">
                                        <p className="max-w-xs">{funnel.aiInsight}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/funnels/${funnel.id}`}>Edit Funnel</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
