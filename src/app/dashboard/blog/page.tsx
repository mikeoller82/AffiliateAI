
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Eye, Clock, Newspaper, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from '@/components/ui/separator';
import { blogTemplates } from '@/lib/blog-templates';

interface Post {
    id: string;
    title: string;
    description: string;
    image: string;
    hint: string;
    status: 'Published' | 'Draft';
    author: string;
    publishDate: string | null;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
                    <p className="text-muted-foreground">
                        Create and manage your content marketing.
                    </p>
                </div>
            </div>

            {posts.length > 0 && (
                <div>
                     <h3 className="text-xl font-semibold tracking-tight mb-4">Your Posts</h3>
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {posts.map(post => (
                            <Card key={post.id} className="overflow-hidden flex flex-col">
                                <div className="relative h-48 w-full">
                                    <Image src={post.image} alt={post.title} fill className="object-cover" data-ai-hint={post.hint} />
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{post.title}</CardTitle>
                                        <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                                            {post.status}
                                        </Badge>
                                    </div>
                                    <CardDescription className="h-10 pt-1">{post.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                <p className="text-xs text-muted-foreground">By {post.author}</p>
                                {post.publishDate && <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3"/> Published on {post.publishDate}</p>}
                                </CardContent>
                                <CardFooter className="mt-auto grid grid-cols-2 gap-2 pt-4">
                                    <Button variant="outline" className="w-full">
                                        <Eye className="mr-2 h-4 w-4" /> View Post
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href={`/dashboard/blog/${post.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Post
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            <div>
                 <h3 className="text-xl font-semibold tracking-tight mb-4">Start from a Template</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {blogTemplates.map(template => (
                        <Card key={template.id} className="overflow-hidden flex flex-col">
                            <div className="relative h-48 w-full bg-muted">
                                <Image src={template.image} alt={template.title} fill className="object-cover" data-ai-hint={template.hint} />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <CardDescription className="h-12 pt-1">{template.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto">
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/blog/${template.id}`}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Use Template
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

    