
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Copy, Edit, Trash2, Link as LinkIcon, BarChart, Users, DollarSign, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const links = [
    { id: 1, name: "Summer Sale Campaign", targetUrl: "https://example.com/summer-sale", trackingId: "summ-aff1", clicks: 1204, conversions: 88, commission: 749.50, status: "Active" },
    { id: 2, name: "New Product Launch", targetUrl: "https://example.com/new-product", trackingId: "newprod-aff1", clicks: 852, conversions: 52, commission: 1250.00, status: "Active" },
    { id: 3, name: "Homepage Banner", targetUrl: "https://example.com/home", trackingId: "home-aff1", clicks: 2341, conversions: 103, commission: 980.20, status: "Active" },
    { id: 4, name: "Old Winter Campaign", targetUrl: "https://example.com/winter-promo", trackingId: "winter-aff1", clicks: 430, conversions: 12, commission: 150.75, status: "Archived" },
];

export default function LinksPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-bold tracking-tight">Affiliate Links</h2>
                    <p className="text-muted-foreground">
                        Manage and analyze your tracking links and campaigns.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Link
                </Button>
            </div>
            
            <div className="space-y-4">
                {links.map((link) => {
                    const ctr = link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;
                    return (
                        <Card key={link.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{link.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 pt-1 text-xs">
                                        <LinkIcon className="h-3 w-3" />
                                        {`https://yourdomain.com/track/${link.trackingId}`}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Badge variant={link.status === "Active" ? "outline" : "secondary"} className={link.status === "Active" ? 'border-green-600 bg-green-50 text-green-700 dark:border-green-500/80 dark:bg-green-950 dark:text-green-400' : ''}>
                                        {link.status}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Copy Link</DropdownMenuItem>
                                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem><BarChart className="mr-2 h-4 w-4" /> View Analytics</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Archive</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                        <Activity className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Clicks</p>
                                            <p className="text-lg font-bold">{link.clicks.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                        <Users className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Conversions</p>
                                            <p className="text-lg font-bold">{link.conversions.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Commission</p>
                                            <p className="text-lg font-bold">${link.commission.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                        <BarChart className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">CTR</p>
                                            <p className="text-lg font-bold">{ctr.toFixed(2)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
