
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Construction } from "lucide-react";

export default function NewsletterEditorPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Construction className="h-6 w-6" />
                        Newsletter Builder Coming Soon!
                    </CardTitle>
                    <CardDescription>
                        The foundation is set, and this feature is next on the roadmap. For now, check out the new Blog Builder.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/blog">
                            Go to Blog Builder
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
