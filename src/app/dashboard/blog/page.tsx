
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Eye, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const posts = [
    {
        id: "how-to-write-great-copy",
        title: "How to Write Copy That Converts in 2025",
        description: "A deep dive into the psychological triggers that make people buy.",
        image: "https://placehold.co/600x400",
        hint: "writing desk",
        status: "Published",
        author: "John Doe",
        publishDate: "2025-06-15",
    },
    {
        id: "ai-in-marketing-trends",
        title: "Top 5 AI Marketing Trends to Watch",
        description: "Discover the AI tools and strategies that are reshaping the industry.",
        image: "https://placehold.co/600x400",
        hint: "AI robot",
        status: "Draft",
        author: "Jane Smith",
        publishDate: null,
    },
];

export default function BlogPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Blog</h2>
                    <p className="text-muted-foreground">
                        Create and manage your content marketing.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/blog/default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Post
                    </Link>
                </Button>
            </div>
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
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[450px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/blog/default" className="flex flex-col items-center justify-center h-full w-full">
                            <PlusCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Create New Post</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}
