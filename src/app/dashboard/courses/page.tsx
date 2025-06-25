
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit, BookOpen, Clock, GraduationCap, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { courseTemplates, defaultCourseTemplate, type CourseTemplate } from '@/lib/course-templates';
import { getUserCourses, createCourse as apiCreateCourse } from '@/lib/firebase-course-api';
import type { Course } from '@/lib/course-types';

export default function CoursesPage() {
    const router = useRouter();
    const [userCourses, setUserCourses] = useState<Course[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isCreatingCourse, setIsCreatingCourse] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoadingCourses(true);
            try {
                // console.log("Fetching user courses...");
                const courses = await getUserCourses();
                // console.log("Fetched courses:", courses);
                setUserCourses(courses);
            } catch (error) {
                console.error("Failed to fetch user courses:", error);
                // Add user-facing error handling here, e.g., toast notification
            } finally {
                setIsLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCreateCourse = async (template?: CourseTemplate) => {
        setIsCreatingCourse(true);
        try {
            let newCourseId: string;
            if (template) {
                const courseDetailsFromTemplate: Partial<Course> = {
                    title: template.title,
                    description: template.description,
                    thumbnailUrl: template.image, // Using template image as thumbnail
                };
                newCourseId = await apiCreateCourse(template.title, template.description, courseDetailsFromTemplate);
            } else {
                // Start from scratch
                newCourseId = await apiCreateCourse(defaultCourseTemplate.title, defaultCourseTemplate.description, {
                    title: defaultCourseTemplate.title,
                    description: defaultCourseTemplate.description,
                    thumbnailUrl: defaultCourseTemplate.image,
                });
            }
            router.push(`/dashboard/courses/${newCourseId}`);
        } catch (error) {
            console.error("Failed to create course:", error);
            // Add user-facing error handling
            setIsCreatingCourse(false); // Only set to false on error, otherwise navigation occurs
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Courses</h2>
                    <p className="text-muted-foreground">
                        Create and manage your online courses and membership content.
                    </p>
                </div>
            </div>

            {/* Existing Courses Section */}
            <div>
                <h3 className="text-xl font-semibold tracking-tight mb-4">My Created Courses</h3>
                {isLoadingCourses ? (
                    <div className="flex items-center justify-center h-32 border border-dashed rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-3 text-muted-foreground">Loading your courses...</p>
                    </div>
                ) : userCourses.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {userCourses.map(course => (
                            <Card key={course.id} className="overflow-hidden flex flex-col">
                                 <div className="relative h-40 w-full bg-muted flex items-center justify-center">
                                    {course.thumbnailUrl ? (
                                        <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                                    ) : (
                                        <GraduationCap className="h-16 w-16 text-gray-300" />
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg truncate" title={course.title}>{course.title}</CardTitle>
                                    {course.description && (
                                        <CardDescription className="h-10 pt-1 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                            {course.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="text-xs text-muted-foreground">
                                    <p className={course.isPublished ? "font-semibold text-green-600" : "font-semibold text-yellow-700"}>
                                        {course.isPublished ? "Published" : "Draft"}
                                    </p>
                                    {/* <p>Modules: {course.modulesOrder?.length || 0}</p> */}
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button asChild className="w-full" variant="outline">
                                        <Link href={`/dashboard/courses/${course.id}`}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit Course
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-lg">
                        <GraduationCap className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-muted-foreground font-medium">You haven&apos;t created any courses yet.</p>
                        <p className="text-sm text-muted-foreground">Get started with a template below or from scratch!</p>
                    </div>
                )}
            </div>
            
            {/* Start from Template Section */}
            <div>
                 <h3 className="text-xl font-semibold tracking-tight mb-4 pt-4 border-t mt-8">Start a New Course</h3>
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
                                <Button onClick={() => handleCreateCourse(template)} className="w-full" disabled={isCreatingCourse || isLoadingCourses}>
                                    {isCreatingCourse ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                    Use Template
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <Card className="flex flex-col items-center justify-center border-dashed hover:border-primary transition-colors min-h-[450px] p-6">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <GraduationCap className="h-12 w-12 text-primary" />
                        </div>
                        <p className="font-semibold text-center text-lg">Start From Scratch</p>
                        <p className="text-sm text-muted-foreground px-4 text-center mb-auto">Build a custom course from the ground up with full control.</p>
                        <Button onClick={() => handleCreateCourse()} className="w-full mt-auto" disabled={isCreatingCourse || isLoadingCourses}>
                            {isCreatingCourse ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Create Blank Course
                        </Button>
                    </Card>
                </div>
            </div>
            {isCreatingCourse && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-white text-lg font-medium">Creating your course...</p>
                    <p className="text-slate-300 text-sm">Please wait a moment.</p>
                </div>
            )}
        </div>
    );
}
