
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    getCourse, updateCourse, getModules, addModule, deleteModule, updateModule, updateModulesOrder, 
    getLessons, addLesson, deleteLesson, updateLesson, updateLessonsOrder 
} from '@/lib/firebase-course-api';
import type { Course, Module, Lesson, LessonContentType, LessonContent } from '@/lib/course-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, GripVertical, Loader2, ArrowLeft, Save, Pencil, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// A small utility to reorder a list
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export default function CourseEditorPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [lessons, setLessons] = useState<{ [moduleId: string]: Lesson[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

    const fetchCourseData = useCallback(async () => {
        setIsLoading(true);
        try {
            const courseData = await getCourse(courseId);
            if (courseData) {
                setCourse(courseData);
                const modulesData = await getModules(courseId, courseData.modulesOrder);
                setModules(modulesData);
                const lessonsData: { [moduleId: string]: Lesson[] } = {};
                for (const module of modulesData) {
                    lessonsData[module.id] = await getLessons(courseId, module.id, module.lessonsOrder);
                }
                setLessons(lessonsData);
            } else {
                toast({ variant: 'destructive', title: 'Course not found' });
                router.push('/dashboard/courses');
            }
        } catch (error) {
            console.error('Failed to fetch course data:', error);
            toast({ variant: 'destructive', title: 'Error loading course data' });
        } finally {
            setIsLoading(false);
        }
    }, [courseId, router, toast]);

    useEffect(() => {
        if (courseId) fetchCourseData();
    }, [courseId, fetchCourseData]);

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === 'MODULE') {
            const reorderedModules = reorder(modules, source.index, destination.index);
            setModules(reorderedModules);
            const newOrder = reorderedModules.map(m => m.id);
            await updateModulesOrder(courseId, newOrder);
            toast({ title: 'Modules reordered' });
        } else if (type === 'LESSON') {
            const moduleId = source.droppableId;
            const reorderedLessons = reorder(lessons[moduleId], source.index, destination.index);
            setLessons(prev => ({ ...prev, [moduleId]: reorderedLessons }));
            const newOrder = reorderedLessons.map(l => l.id);
            await updateLessonsOrder(courseId, moduleId, newOrder);
            toast({ title: 'Lessons reordered' });
        }
    };
    
    const handleAddNewModule = async () => {
        const { moduleId } = await addModule(courseId, 'New Module');
        await fetchCourseData(); // Refetch to get all data correctly
        setEditingModuleId(moduleId);
    };

    const handleAddNewLesson = async (moduleId: string) => {
        const { lessonId } = await addLesson(courseId, moduleId, 'New Lesson', 'text', { text: '' });
        await fetchCourseData();
        setEditingLessonId(lessonId);
    };

    if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
    if (!course) return <div className="text-center py-12">Course not found.</div>;

    return (
        <div className="space-y-8 mb-8">
            <Button variant="ghost" onClick={() => router.push('/dashboard/courses')} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Courses
            </Button>
            <Card>
                <CardHeader>
                    <Input defaultValue={course.title} onBlur={e => updateCourse(courseId, { title: e.target.value })} className="text-2xl font-bold" />
                    <Textarea defaultValue={course.description} onBlur={e => updateCourse(courseId, { description: e.target.value })} placeholder="Add a course description..." className="text-muted-foreground" />
                </CardHeader>
            </Card>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="all-modules" type="MODULE">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                            {modules.map((module, index) => (
                                <Draggable key={module.id} draggableId={module.id} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps}>
                                            <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-grow">
                                                        <div {...provided.dragHandleProps}><GripVertical className="h-5 w-5 text-muted-foreground" /></div>
                                                        <Input defaultValue={module.title} onBlur={e => updateModule(courseId, module.id, { title: e.target.value })} className="font-semibold text-lg" />
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => deleteModule(courseId, module.id).then(fetchCourseData)}><Trash2 className="h-4 w-4" /></Button>
                                                </CardHeader>
                                                <CardContent>
                                                    <Droppable droppableId={module.id} type="LESSON">
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 ml-10">
                                                                {lessons[module.id]?.map((lesson, index) => (
                                                                    <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                                                        {(provided) => (
                                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                                                                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                                                <Input defaultValue={lesson.title} onBlur={e => updateLesson(courseId, module.id, lesson.id, { title: e.target.value })} />
                                                                                <Button variant="ghost" size="icon" onClick={() => deleteLesson(courseId, module.id, lesson.id).then(fetchCourseData)}><Trash2 className="h-4 w-4" /></Button>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                    <Button variant="secondary" onClick={() => handleAddNewLesson(module.id)} className="mt-4 ml-10"><PlusCircle className="mr-2 h-4 w-4" /> Add Lesson</Button>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Button onClick={handleAddNewModule}><PlusCircle className="mr-2 h-4 w-4" /> Add Module</Button>
        </div>
    );
}
