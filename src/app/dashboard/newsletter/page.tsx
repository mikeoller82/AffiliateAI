
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const newsletters = [
    {
        id: "product-update-q2",
        title: "Q2 Product Updates",
        description: "Announcing new features and improvements for our users.",
        image: "https://placehold.co/600x400",
        hint: "product announcement",
    },
    {
        id: "weekly-tips",
        title: "Weekly Growth Tips",
        description: "A roundup of the best marketing tips of the week.",
        image: "https://placehold.co/600x400",
        hint: "newsletter email",
    },
];

export default function NewslettersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Newsletters</h2>
                    <p className="text-muted-foreground">
                        Create and manage your email-style landing pages.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/newsletter/default">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Newsletter
                    </Link>
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {newsletters.map(newsletter => (
                    <Card key={newsletter.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48 w-full">
                            <Image src={newsletter.image} alt={newsletter.title} fill className="object-cover" data-ai-hint={newsletter.hint} />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-lg">{newsletter.title}</CardTitle>
                            <CardDescription className="h-10 pt-1">{newsletter.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Button asChild className="w-full">
                                <Link href={`/dashboard/newsletter/${newsletter.id}`}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Newsletter
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
                 <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[380px]">
                    <Button asChild variant="ghost" className="h-full w-full">
                         <Link href="/dashboard/newsletter/default" className="flex flex-col items-center justify-center h-full w-full">
                            <PlusCircle className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">Create New Newsletter</p>
                        </Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
}

