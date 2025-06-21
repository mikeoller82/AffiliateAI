import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Copy, Edit, Trash2 } from "lucide-react";
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Affiliate Links</CardTitle>
                        <CardDescription>Manage your tracking links and campaigns.</CardDescription>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Link
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Clicks</TableHead>
                                <TableHead className="text-right">Conversions</TableHead>
                                <TableHead className="text-right">Commission</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {links.map((link) => (
                                <TableRow key={link.id}>
                                    <TableCell className="font-medium">
                                        <div>{link.name}</div>
                                        <div className="text-xs text-muted-foreground">{`/track/${link.trackingId}`}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={link.status === "Active" ? "secondary" : "outline"} className={link.status === "Active" ? 'bg-green-500/20 text-green-700' : ''}>{link.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{link.clicks.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{link.conversions.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">${link.commission.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
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
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
