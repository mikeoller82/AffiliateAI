import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, BarChart, Send, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const campaigns = [
    { id: 1, name: "Welcome Sequence", status: "Active", sent: 1250, openRate: "45.8%", clickRate: "12.3%" },
    { id: 2, name: "Summer Promo 2024", status: "Sent", sent: 8730, openRate: "22.1%", clickRate: "4.5%" },
    { id: 3, name: "New Product Teaser", status: "Draft", sent: 0, openRate: "N/A", clickRate: "N/A" },
    { id: 4, name: "Weekly Newsletter", status: "Active", sent: 22400, openRate: "35.2%", clickRate: "8.9%" },
];

const subscribers = [
    { id: 1, email: "john.doe@example.com", name: "John Doe", date: "2024-05-20", avatar: "https://placehold.co/40x40" },
    { id: 2, email: "jane.smith@example.com", name: "Jane Smith", date: "2024-05-19", avatar: "https://placehold.co/40x40" },
    { id: 3, email: "samuel.green@example.com", name: "Samuel Green", date: "2024-05-19", avatar: "https://placehold.co/40x40" },
    { id: 4, email: "lisa.white@example.com", name: "Lisa White", date: "2024-05-18", avatar: "https://placehold.co/40x40" },
];

export default function EmailPage() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Email Campaigns</CardTitle>
                            <CardDescription>Manage your email sequences and broadcasts.</CardDescription>
                        </div>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Campaign
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Open Rate</TableHead>
                                    <TableHead className="text-right">Click Rate</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">{campaign.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>{campaign.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{campaign.openRate}</TableCell>
                                        <TableCell className="text-right">{campaign.clickRate}</TableCell>
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
                                                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                                    <DropdownMenuItem><BarChart className="mr-2 h-4 w-4" /> View Stats</DropdownMenuItem>
                                                    <DropdownMenuItem><Send className="mr-2 h-4 w-4" /> Send</DropdownMenuItem>
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
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Subscribers</CardTitle>
                        <CardDescription>Your newest audience members.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {subscribers.map(sub => (
                             <div className="flex items-center gap-4" key={sub.id}>
                                <Avatar>
                                    <AvatarImage src={sub.avatar} data-ai-hint="profile avatar"/>
                                    <AvatarFallback>{sub.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-none">{sub.name}</p>
                                    <p className="text-sm text-muted-foreground">{sub.email}</p>
                                </div>
                                <div className="text-sm text-muted-foreground">{sub.date}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
