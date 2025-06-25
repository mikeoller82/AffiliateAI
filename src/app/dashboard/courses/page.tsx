
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, BookOpen, Clock, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { courseTemplates } from '@/lib/course-templates';

export default function CoursesPage() {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Courses</h2>
                    <p className="text-muted-foreground">
                        Create and manage your online courses and membership content.
                    </p>
                </div>
            </div>
            
            <div>
                 <h3 className="text-xl font-semibold tracking-tight mb-4">Start from a Template</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {courseTemplates.map(template => (
                        <Card key={template.id} className="overflow-hidden flex flex-col">
                            <div className="relative h-48 w-full bg-muted">
                                <Image src={template.image} alt={template.title} fill className="object-cover" data-ai-hint={template.hint} />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <CardDescription className="h-10 pt-1">{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4 text-center text-sm">
                                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                    <span className="font-bold">{template.lessonsCount} Lessons</span>
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 rounded-lg border p-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="font-bold">{template.hours} Hours</span>
                                </div>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/courses/${template.id}`}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Use Template
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[450px]">
                        <Button asChild variant="ghost" className="h-full w-full">
                            <Link href="/dashboard/courses/default" className="flex flex-col items-center justify-center h-full w-full text-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <GraduationCap className="h-12 w-12 text-primary" />
                                </div>
                                <p className="font-semibold">Start From Scratch</p>
                                <p className="text-sm text-muted-foreground px-4">Build a custom course from the ground up.</p>
                            </Link>
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
