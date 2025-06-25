
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    PlusCircle, BookOpen, FileText, Loader2, ArrowLeft, RefreshCw, Edit3, Trash2, X, Save, Video, Type
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


import type { Course, Module, Lesson, LessonContent } from '@/lib/course-types';
import { LessonContentType } from '@/lib/course-types';
import {
    getCourse,
    getModules,
    getLessons,
    addModule as apiAddModule,
    updateModule as apiUpdateModule,
    deleteModule as apiDeleteModule,
    addLesson as apiAddLesson,
    updateLesson as apiUpdateLesson,
    deleteLesson as apiDeleteLesson,
    updateCourse as apiUpdateCourse,
} from '@/lib/firebase-course-api';
import Link from 'next/link';

// Component for inline editing
interface InlineEditProps {
    value: string;
    onSave: (newValue: string) => Promise<void>;
    isSaving: boolean;
    placeholder?: string;
    multiline?: boolean; // Added for Textarea support
    inputClassName?: string;
    textClassName?: string;
}

const InlineEdit: React.FC<InlineEditProps> = ({ value, onSave, isSaving, placeholder, multiline, inputClassName, textClassName }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleSave = async () => {
        if (currentValue.trim() === value?.trim() || (currentValue.trim() === "" && !value?.trim())) { // Adjusted for potentially undefined initial value
            setIsEditing(false);
            setCurrentValue(value);
            return;
        }
        await onSave(currentValue.trim());
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !multiline && !e.shiftKey) { // For single line, Enter saves. For multiline, only if not Shift+Enter
            e.preventDefault(); // Prevent newline in input
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setCurrentValue(value);
        }
    };

    const commonProps = {
        value: currentValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
        onBlur: handleSave, // Save on blur
        onKeyDown: handleKeyDown,
        autoFocus: true,
        className: inputClassName || (multiline ? "text-sm p-2 border rounded-md min-h-[60px]" : "h-8 text-lg font-bold"), // Example classes
        placeholder: placeholder || "Enter value",
        disabled: isSaving,
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 w-full">
                {multiline ? (
                    <Textarea {...commonProps} rows={3} />
                ) : (
                    <Input type="text" {...commonProps} />
                )}
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 group cursor-text min-h-[32px] w-full ${textClassName || ''}`} onClick={() => setIsEditing(true)}>
            <span className="truncate whitespace-pre-wrap w-full" title={value}>{value || <span className="text-muted-foreground italic">{placeholder || "Click to edit"}</span>}</span>
            <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
    );
};


export default function CourseEditorPage() {
    const params = useParams<{ courseId: string }>();
    const router = useRouter();
    const courseId = params.courseId;

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [lessonsByModule, setLessonsByModule] = useState<{ [moduleId: string]: Lesson[] }>({});

    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [isLoadingModules, setIsLoadingModules] = useState(false);
    const [isLoadingLessons, setIsLoadingLessons] = useState<{ [moduleId: string]: boolean }>({});
    const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});

    const [newModuleName, setNewModuleName] = useState('');
    const [newLessonInputs, setNewLessonInputs] = useState<{ [moduleId: string]: { title: string, type: LessonContentType } }>({});

    const [isAddingModule, setIsAddingModule] = useState(false);
    const [isAddingLesson, setIsAddingLesson] = useState<{ [moduleId: string]: boolean }>({});

    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [currentLessonContent, setCurrentLessonContent] = useState<LessonContent>({});
    const [isLessonContentDialogOpen, setIsLessonContentDialogOpen] = useState(false);
    const [isSavingLessonContent, setIsSavingLessonContent] = useState(false);

    const findModuleIdForLesson = useCallback((lessonId: string): string | undefined => {
        for (const mod of modules) {
            if (mod.lessonsOrder.includes(lessonId)) {
                return mod.id;
            }
        }
        return undefined;
    }, [modules]);
    
    const fetchCourseData = useCallback(async () => {
        if (!courseId) return;
        setIsLoadingCourse(true);
        setIsLoadingModules(true); // Start loading modules at the same time
        try {
            const courseData = await getCourse(courseId);
            setCourse(courseData);
            if (courseData) {
                const modulesData = await getModules(courseData.id, courseData.modulesOrder);
                setModules(modulesData);
                
                // Fetch lessons for all modules
                const lessonPromises = modulesData.map(module => getLessons(courseData.id, module.id, module.lessonsOrder));
                const allLessons = await Promise.all(lessonPromises);
                
                const lessonsMap: { [moduleId: string]: Lesson[] } = {};
                modulesData.forEach((module, index) => {
                    lessonsMap[module.id] = allLessons[index];
                });
                setLessonsByModule(lessonsMap);
            }
        } catch (error) {
            console.error("Failed to fetch course data:", error);
        } finally {
            setIsLoadingCourse(false);
            setIsLoadingModules(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseData();
    }, [courseId, fetchCourseData]);

    const handleUpdateCourseDetails = async (updates: Partial<Course>) => {
        if (!course) return;
        const key = updates.title ? 'courseTitle' : 'courseDescription';
        setIsSaving(prev => ({ ...prev, [key]: true }));
        try {
            await apiUpdateCourse(course.id, updates);
            setCourse(prev => prev ? { ...prev, ...updates } : null);
        } catch (error) {
            console.error("Failed to update course details:", error);
            // Potentially revert UI optimistically
        } finally {
            setIsSaving(prev => ({ ...prev, [key]: false }));
        }
    };

    const handleAddModule = async () => {
        if (!course || !newModuleName.trim()) return;
        setIsAddingModule(true);
        try {
            const { moduleId: newModuleId, updatedModulesOrder } = await apiAddModule(course.id, newModuleName.trim(), '');
            const newModuleData: Module = {
                id: newModuleId,
                title: newModuleName.trim(),
                lessonsOrder: [],
                description: ''
            };
            setModules(prev => [...prev, newModuleData]);
            setCourse(prevCourse => prevCourse ? {...prevCourse, modulesOrder: updatedModulesOrder} : null);
            setNewModuleName('');
            setLessonsByModule(prev => ({ ...prev, [newModuleId]: [] }));
        } catch (error) {
            console.error("Failed to add module:", error);
        } finally {
            setIsAddingModule(false);
        }
    };
    const handleUpdateModuleTitle = async (moduleId: string, newTitle: string) => {
        if (!course) return;
        setIsSaving(prev => ({ ...prev, [`moduleTitle_${moduleId}`]: true }));
        try {
            await apiUpdateModule(course.id, moduleId, { title: newTitle });
            setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title: newTitle } : m));
        } catch (error) {
            console.error("Failed to update module title:", error);
        } finally {
            setIsSaving(prev => ({ ...prev, [`moduleTitle_${moduleId}`]: false }));
        }
    };
    const handleDeleteModule = async (moduleId: string) => {
        if (!course) return;
        setIsSaving(prev => ({ ...prev, [`moduleDelete_${moduleId}`]: true }));
        try {
            const updatedModulesOrder = await apiDeleteModule(course.id, moduleId);
            setModules(prev => prev.filter(m => m.id !== moduleId));
            setCourse(prevCourse => prevCourse ? { ...prevCourse, modulesOrder: updatedModulesOrder } : null);
            setLessonsByModule(prev => {
                const newState = { ...prev };
                delete newState[moduleId];
                return newState;
            });
        } catch (error) {
            console.error("Failed to delete module:", error);
        } finally {
            setIsSaving(prev => ({ ...prev, [`moduleDelete_${moduleId}`]: false }));
        }
    };

    const handleAddLesson = async (moduleId: string) => {
        if (!course || !newLessonInputs[moduleId]?.title.trim()) return;

        setIsAddingLesson(prev => ({...prev, [moduleId]: true}));
        const { title: lessonTitle, type: lessonType } = newLessonInputs[moduleId];
        try {
            const initialContent: LessonContent = lessonType === LessonContentType.VIDEO ? { videoUrl: '' } : { text: 'New lesson content...' };
            const { lessonId: newLessonId, updatedLessonsOrder } = await apiAddLesson(
                course.id,
                moduleId,
                lessonTitle.trim(),
                lessonType,
                initialContent
            );
            const newLessonData: Lesson = {
                id: newLessonId,
                title: lessonTitle.trim(),
                contentType: lessonType,
                content: initialContent
            };
            setLessonsByModule(prev => ({
                ...prev,
                [moduleId]: [...(prev[moduleId] || []), newLessonData]
            }));
            setModules(prevModules => prevModules.map(mod =>
                mod.id === moduleId ? { ...mod, lessonsOrder: updatedLessonsOrder } : mod
            ));
            setNewLessonInputs(prev => ({ ...prev, [moduleId]: { title: '', type: LessonContentType.TEXT } }));
        } catch (error) {
            console.error("Failed to add lesson:", error);
        } finally {
            setIsAddingLesson(prev => ({...prev, [moduleId]: false}));
        }
    };
    const handleUpdateLessonTitle = async (moduleId: string, lessonId: string, newTitle: string) => {
        if (!course) return;
        setIsSaving(prev => ({ ...prev, [`lessonTitle_${lessonId}`]: true }));
        try {
            await apiUpdateLesson(course.id, moduleId, lessonId, { title: newTitle });
            setLessonsByModule(prev => ({
                ...prev,
                [moduleId]: prev[moduleId]?.map(l => l.id === lessonId ? { ...l, title: newTitle } : l) || []
            }));
        } catch (error) {
            console.error("Failed to update lesson title:", error);
        } finally {
            setIsSaving(prev => ({ ...prev, [`lessonTitle_${lessonId}`]: false }));
        }
    };
    const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
        if (!course) return;
        setIsSaving(prev => ({ ...prev, [`lessonDelete_${lessonId}`]: true }));
        try {
            const updatedLessonsOrder = await apiDeleteLesson(course.id, moduleId, lessonId);
            setLessonsByModule(prev => ({
                ...prev,
                [moduleId]: prev[moduleId]?.filter(l => l.id !== lessonId) || []
            }));
            setModules(prevModules => prevModules.map(mod =>
                mod.id === moduleId ? { ...mod, lessonsOrder: updatedLessonsOrder } : mod
            ));
        } catch (error) {
            console.error("Failed to delete lesson:", error);
        } finally {
            setIsSaving(prev => ({ ...prev, [`lessonDelete_${lessonId}`]: false }));
        }
    };
    const openLessonContentEditor = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setCurrentLessonContent(JSON.parse(JSON.stringify(lesson.content || {}))); // Deep copy
        setIsLessonContentDialogOpen(true);
    };
    const handleSaveLessonContent = async () => {
        if (!course || !editingLesson) return;
        const moduleId = findModuleIdForLesson(editingLesson.id);
        if (!moduleId) {
            console.error("Module ID not found for lesson", editingLesson.id);
            return;
        }
        setIsSavingLessonContent(true);
        try {
            await apiUpdateLesson(course.id, moduleId, editingLesson.id, { content: currentLessonContent, contentType: editingLesson.contentType });
            setLessonsByModule(prev => ({
                ...prev,
                [moduleId]: prev[moduleId]?.map(l => l.id === editingLesson.id ? { ...l, content: currentLessonContent, contentType: editingLesson.contentType } : l) || []
            }));
            setIsLessonContentDialogOpen(false);
            setEditingLesson(null);
        } catch (error) {
            console.error("Failed to save lesson content:", error);
        } finally {
            setIsSavingLessonContent(false);
        }
    };

    const sortedModules = useMemo(() => {
        if (!course?.modulesOrder) return modules;
        return [...modules].sort((a, b) => {
            const orderA = course.modulesOrder?.indexOf(a.id) ?? modules.length;
            const orderB = course.modulesOrder?.indexOf(b.id) ?? modules.length;
            return orderA - orderB;
        });
    }, [modules, course?.modulesOrder]);

    const getSortedLessons = useCallback((moduleId: string): Lesson[] => {
        const module = modules.find(m => m.id === moduleId);
        const lessons = lessonsByModule[moduleId] || [];
        if (!module?.lessonsOrder) return lessons;

        return [...lessons].sort((a,b) => {
            const orderA = module.lessonsOrder?.indexOf(a.id) ?? lessons.length;
            const orderB = module.lessonsOrder?.indexOf(b.id) ?? lessons.length;
            return orderA - orderB;
        });
    }, [lessonsByModule, modules]);

    if (isLoadingCourse && !course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading course editor...</p>
            </div>
        );
    }
    if (!course && !isLoadingCourse) {
         return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 text-center">
                 <FileText className="h-12 w-12 text-destructive mb-4" />
                <p className="text-xl font-semibold">Course Not Found</p>
                <p className="mt-2 text-muted-foreground max-w-md">
                    The course with ID <span className="font-mono text-primary bg-muted px-1 py-0.5 rounded">{courseId}</span> could not be loaded. It may have been deleted or the ID is incorrect.
                </p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/dashboard/courses">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                    </Link>
                </Button>
            </div>
        );
    }
    if (!course) return null;


    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto mb-20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                 <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/courses')} className="self-start sm:self-center">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate" title={course.title}>
                        Editing: {course.title}
                    </h1>
                </div>
                <Button variant="ghost" size="sm" onClick={() => fetchCourseData()} disabled={isLoadingCourse || isLoadingModules || Object.values(isSaving).some(s => s)} className="text-muted-foreground hover:text-primary">
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingCourse || isLoadingModules || Object.values(isLoadingLessons).some(l=>l) ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="w-full">
                        <InlineEdit
                            value={course.title}
                            onSave={(newTitle) => handleUpdateCourseDetails({ title: newTitle })}
                            isSaving={isSaving['courseTitle'] || false}
                            placeholder="Enter course title"
                            inputClassName="text-2xl font-bold h-10"
                            textClassName="text-2xl font-bold"
                        />
                    </div>
                     <div className="text-sm text-muted-foreground w-full mt-1">
                        <InlineEdit
                            value={course.description || ''}
                            onSave={(newDesc) => handleUpdateCourseDetails({ description: newDesc })}
                            isSaving={isSaving['courseDescription'] || false}
                            placeholder="Enter course description (optional)"
                            multiline
                            inputClassName="text-sm p-2 border rounded-md min-h-[60px] w-full"
                            textClassName="text-sm w-full"
                        />
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Modules & Lessons</CardTitle>
                    <CardDescription>Organize your course content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 items-start sm:items-center flex-col sm:flex-row">
                        <Input
                            type="text" placeholder="Enter new module name" value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)} className="flex-grow"
                            disabled={isAddingModule || Object.values(isSaving).some(s => s)} aria-label="New module name"
                        />
                        <Button onClick={handleAddModule} disabled={!newModuleName.trim() || isAddingModule || Object.values(isSaving).some(s => s)} className="w-full sm:w-auto">
                            {isAddingModule ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                            Add Module
                        </Button>
                    </div>

                    {isLoadingModules && modules.length === 0 && (
                        <div className="flex items-center text-muted-foreground justify-center py-4">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading modules...
                        </div>
                    )}
                    {sortedModules.length === 0 && !isLoadingModules && (
                        <p className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-md">
                            This course has no modules yet. <br/> Add your first module above to structure your content.
                        </p>
                    )}

                    <div className="space-y-6">
                        {sortedModules.map((module) => (
                            <Card key={module.id} className="bg-background shadow-sm border">
                                <CardHeader className="pb-4 flex flex-row justify-between items-start">
                                    <div className="flex-grow min-w-0">
                                        <InlineEdit
                                            value={module.title}
                                            onSave={(newTitle) => handleUpdateModuleTitle(module.id, newTitle)}
                                            isSaving={isSaving[`moduleTitle_${module.id}`] || false}
                                            placeholder="Module title"
                                            inputClassName="text-lg font-semibold h-9"
                                            textClassName="text-lg font-semibold"
                                        />
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 flex-shrink-0 ml-2" disabled={Object.values(isSaving).some(s => s) || isSaving[`moduleDelete_${module.id}`]}>
                                                {isSaving[`moduleDelete_${module.id}`] ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Delete Module?</AlertDialogTitle></AlertDialogHeader>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete the module "{module.title}"? This will also delete all lessons within it. This action cannot be undone.
                                            </AlertDialogDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteModule(module.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                                    Delete Module
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <h4 className="font-medium text-sm text-muted-foreground border-b pb-2 mb-3">Lessons in this module</h4>
                                    {isLoadingLessons[module.id] && (lessonsByModule[module.id] || []).length === 0 && (
                                         <div className="flex items-center text-xs text-muted-foreground p-2">
                                            <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Loading lessons...
                                        </div>
                                    )}
                                    {getSortedLessons(module.id).length === 0 && !isLoadingLessons[module.id] && (
                                        <p className="text-xs text-muted-foreground pl-1 py-2">No lessons in this module yet. Add one below.</p>
                                    )}

                                    {getSortedLessons(module.id).length > 0 && (
                                        <ul className="space-y-2">
                                            {getSortedLessons(module.id).map(lesson => (
                                                <li key={lesson.id} className="text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center p-2.5 rounded-md border bg-muted/30 hover:bg-muted/60 gap-2">
                                                    <div className="flex-grow min-w-0">
                                                         <InlineEdit
                                                            value={lesson.title}
                                                            onSave={(newTitle) => handleUpdateLessonTitle(module.id, lesson.id, newTitle)}
                                                            isSaving={isSaving[`lessonTitle_${lesson.id}`] || false}
                                                            placeholder="Lesson title"
                                                            inputClassName="text-sm h-8"
                                                            textClassName="text-sm"
                                                        />
                                                        <span className="ml-0 mt-1 sm:mt-0 sm:ml-2 text-xs text-muted-foreground bg-primary/10 px-1.5 py-0.5 rounded inline-block">
                                                            {lesson.contentType === LessonContentType.TEXT ? <Type className="inline h-3 w-3 mr-1"/> : <Video className="inline h-3 w-3 mr-1"/>}
                                                            {lesson.contentType}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1 self-end sm:self-center flex-shrink-0">
                                                        <Button variant="outline" size="xs" onClick={() => openLessonContentEditor(lesson)} disabled={Object.values(isSaving).some(s => s)}>
                                                            <Edit3 className="h-3 w-3 mr-1" /> Edit Content
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="xs" className="text-destructive hover:bg-destructive/10" disabled={Object.values(isSaving).some(s => s) || isSaving[`lessonDelete_${lesson.id}`]}>
                                                                     {isSaving[`lessonDelete_${lesson.id}`] ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-3 w-3" />}
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader><AlertDialogTitle>Delete Lesson?</AlertDialogTitle></AlertDialogHeader>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete the lesson "{lesson.title}"? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteLesson(module.id, lesson.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                                                        Delete Lesson
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="flex gap-2 items-end pt-3 border-t flex-col sm:flex-row">
                                        <div className="flex-grow w-full sm:w-auto">
                                            <label htmlFor={`newLessonName-${module.id}`} className="text-xs font-medium text-muted-foreground">Lesson Name</label>
                                            <Input
                                                id={`newLessonName-${module.id}`} type="text" placeholder="Enter new lesson name"
                                                value={newLessonInputs[module.id]?.title || ''}
                                                onChange={(e) => setNewLessonInputs(prev => ({ ...prev, [module.id]: { ...(prev[module.id] || { type: LessonContentType.TEXT }), title: e.target.value } }))}
                                                className="text-sm h-9 mt-1" disabled={isAddingLesson[module.id] || Object.values(isSaving).some(s => s)}
                                                aria-label={`New lesson name for module ${module.title}`}
                                            />
                                        </div>
                                        <div className="w-full sm:w-auto sm:min-w-[120px]">
                                             <label htmlFor={`newLessonType-${module.id}`} className="text-xs font-medium text-muted-foreground">Type</label>
                                            <Select
                                                value={newLessonInputs[module.id]?.type || LessonContentType.TEXT}
                                                onValueChange={(value: LessonContentType) => setNewLessonInputs(prev => ({ ...prev, [module.id]: { ...(prev[module.id] || { title: '' }), type: value } }))}
                                                disabled={isAddingLesson[module.id] || Object.values(isSaving).some(s => s)}
                                            >
                                                <SelectTrigger className="h-9 mt-1 text-xs" id={`newLessonType-${module.id}`}>
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={LessonContentType.TEXT} className="text-xs">Text</SelectItem>
                                                    <SelectItem value={LessonContentType.VIDEO} className="text-xs">Video</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => handleAddLesson(module.id)}
                                            disabled={!newLessonInputs[module.id]?.title.trim() || isAddingLesson[module.id] || Object.values(isSaving).some(s => s)}
                                            className="w-full sm:w-auto mt-2 sm:mt-0 self-end h-9"
                                        >
                                            {isAddingLesson[module.id] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                            Add Lesson
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {editingLesson && (
                <Dialog open={isLessonContentDialogOpen} onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setIsLessonContentDialogOpen(false);
                        setEditingLesson(null);
                    } else {
                        setIsLessonContentDialogOpen(true);
                    }
                }}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Lesson: {editingLesson.title}</DialogTitle>
                            <DialogDescription>
                                Modifying content for a <span className="font-semibold">{editingLesson.contentType}</span> lesson.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                            {editingLesson.contentType === LessonContentType.TEXT && (
                                <div>
                                    <label htmlFor="lessonTextContent" className="block text-sm font-medium text-muted-foreground mb-1">Text Content</label>
                                    <Textarea
                                        id="lessonTextContent"
                                        placeholder="Enter lesson text here..."
                                        value={currentLessonContent.text || ''}
                                        onChange={(e) => setCurrentLessonContent(prev => ({ ...prev, text: e.target.value }))}
                                        rows={10}
                                        disabled={isSavingLessonContent}
                                    />
                                </div>
                            )}
                            {editingLesson.contentType === LessonContentType.VIDEO && (
                                <div>
                                    <label htmlFor="lessonVideoUrl" className="block text-sm font-medium text-muted-foreground mb-1">Video URL</label>
                                    <Input
                                        id="lessonVideoUrl"
                                        placeholder="e.g., https://www.youtube.com/watch?v=..."
                                        value={currentLessonContent.videoUrl || ''}
                                        onChange={(e) => setCurrentLessonContent(prev => ({ ...prev, videoUrl: e.target.value }))}
                                        disabled={isSavingLessonContent}
                                    />
                                     <p className="text-xs text-muted-foreground mt-1">Enter the full URL of the video (e.g., YouTube, Vimeo).</p>
                                </div>
                            )}
                             <div>
                                <label htmlFor="lessonContentTypeSelect" className="block text-sm font-medium text-muted-foreground mb-1">Lesson Type</label>
                                 <Select
                                    value={editingLesson.contentType}
                                    onValueChange={(newType: LessonContentType) => {
                                        setEditingLesson(prev => prev ? {...prev, contentType: newType} : null);
                                        if (newType === LessonContentType.TEXT && currentLessonContent.videoUrl && !currentLessonContent.text) {
                                            setCurrentLessonContent({ text: '' }); // Clear video URL or provide migration logic
                                        } else if (newType === LessonContentType.VIDEO && currentLessonContent.text && !currentLessonContent.videoUrl) {
                                            setCurrentLessonContent({ videoUrl: '' }); // Clear text or provide migration logic
                                        }
                                    }}
                                    disabled={isSavingLessonContent}
                                >
                                    <SelectTrigger id="lessonContentTypeSelect">
                                        <SelectValue placeholder="Select lesson type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={LessonContentType.TEXT}>Text based</SelectItem>
                                        <SelectItem value={LessonContentType.VIDEO}>Video based</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isSavingLessonContent}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleSaveLessonContent} disabled={isSavingLessonContent}>
                                {isSavingLessonContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Content
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
