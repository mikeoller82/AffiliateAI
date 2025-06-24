
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Upload, Tag, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Contact {
    id: number;
    name: string;
    email: string;
    avatar: string;
    date: string;
    tags: string[];
}

export default function ContactsPage() {
    const { toast } = useToast();
    const [contacts, setContacts] = useState<Contact[]>([]);
    
    const handleDeleteContact = (id: number) => {
        setContacts(contacts.filter(c => c.id !== id));
        toast({
            title: "Contact Deleted",
            description: "The contact has been successfully deleted.",
        });
    };
    
    const handleAction = (action: string) => {
        toast({
            title: "Action Triggered",
            description: `The "${action}" action is not yet implemented.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
                    <p className="text-muted-foreground">
                        Manage your audience and contact list.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleAction('Import Contacts')}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Contacts
                    </Button>
                    <Button onClick={() => handleAction('Add Contact')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Contact
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search contacts..." className="w-full max-w-sm pl-9" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Date Added</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No contacts found.
                                    </TableCell>
                                </TableRow>
                            ) : contacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={contact.avatar} data-ai-hint="profile avatar" />
                                                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div>{contact.name}</div>
                                                <div className="text-xs text-muted-foreground">{contact.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {contact.tags.map(tag => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{contact.date}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleAction('Edit Contact')}><Edit className="mr-2 h-4 w-4" /> Edit Contact</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('Add/Remove Tags')}><Tag className="mr-2 h-4 w-4" /> Add/Remove Tags</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteContact(contact.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete Contact</DropdownMenuItem>
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
