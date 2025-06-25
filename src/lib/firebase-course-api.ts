
import type { Course, Module, Lesson, LessonContent, LessonContentType, FirestoreTimestamp } from './course-types';
import { courseTemplates, defaultCourseTemplate } from './course-templates';
import { nanoid } from 'nanoid';

// --- In-Memory Mock Database ---

const createTimestamp = (): FirestoreTimestamp => {
    const now = new Date();
    return {
        seconds: Math.floor(now.getTime() / 1000),
        nanoseconds: (now.getTime() % 1000) * 1000000,
        toDate: () => now,
    };
};

let courses: Course[] = courseTemplates
    .filter(t => t.id !== 'default') // Exclude the blank template from initial data
    .map(template => ({
        id: template.id,
        title: template.title,
        description: template.description,
        thumbnailUrl: template.image,
        instructorId: 'mock-user-id',
        isPublished: false,
        modulesOrder: [`module-1-${template.id}`, `module-2-${template.id}`],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
    }));

let modulesByCourseId: { [courseId: string]: Module[] } = {};
let lessonsByModuleId: { [moduleId: string]: Lesson[] } = {};

courses.forEach(course => {
    const mod1Id = `module-1-${course.id}`;
    const mod2Id = `module-2-${course.id}`;
    const lesson1Id = `lesson-1-1-${course.id}`;

    modulesByCourseId[course.id] = [
        { id: mod1Id, title: 'Module 1: Introduction', description: 'Getting started with the course.', lessonsOrder: [lesson1Id] },
        { id: mod2Id, title: 'Module 2: Core Concepts', description: 'Diving into the main topics.', lessonsOrder: [] },
    ];
    lessonsByModuleId[mod1Id] = [{ id: lesson1Id, title: 'Welcome to the Course!', contentType: 'text' as LessonContentType.TEXT, content: { text: 'Your first lesson content goes here.' } }];
    lessonsByModuleId[mod2Id] = [];
});

// --- API Functions (rewritten to use in-memory store) ---

// Helper to get current user ID (mocked)
const getCurrentUserId = (): string => "mock-user-id";

// --- Course Functions ---

export const createCourse = async (
    title: string,
    description?: string,
    template?: Partial<Course>
): Promise<string> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');

    const newCourseData: Course = {
        id: nanoid(),
        title: title || defaultCourseTemplate.title,
        description: description || defaultCourseTemplate.description,
        instructorId,
        thumbnailUrl: template?.thumbnailUrl || defaultCourseTemplate.image,
        isPublished: false,
        modulesOrder: [],
        createdAt: createTimestamp(),
        updatedAt: createTimestamp(),
    };
    courses.push(newCourseData);
    modulesByCourseId[newCourseData.id] = [];
    return Promise.resolve(newCourseData.id);
};

export const getUserCourses = async (): Promise<Course[]> => {
    return Promise.resolve([...courses]);
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
    const course = courses.find(c => c.id === courseId) || null;
    return Promise.resolve(course);
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
    courses = courses.map(c => (c.id === courseId ? { ...c, ...updates, updatedAt: createTimestamp() } : c));
    return Promise.resolve();
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        course.modulesOrder.forEach(moduleId => {
            delete lessonsByModuleId[moduleId];
        });
        delete modulesByCourseId[courseId];
        courses = courses.filter(c => c.id !== courseId);
    }
    return Promise.resolve();
};


// --- Module Functions ---

export const addModule = async (courseId: string, title: string, description?: string): Promise<{ moduleId: string, updatedModulesOrder: string[] }> => {
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    
    const newModule: Module = {
        id: nanoid(),
        title,
        description: description || '',
        lessonsOrder: [],
    };
    
    modulesByCourseId[courseId] = [...(modulesByCourseId[courseId] || []), newModule];
    lessonsByModuleId[newModule.id] = [];
    course.modulesOrder.push(newModule.id);
    
    return Promise.resolve({ moduleId: newModule.id, updatedModulesOrder: course.modulesOrder });
};

export const getModules = async (courseId: string, modulesOrderFromCourse?: string[]): Promise<Module[]> => {
    const modules = modulesByCourseId[courseId] || [];
    const order = modulesOrderFromCourse || courses.find(c => c.id === courseId)?.modulesOrder || [];
    
    const sortedModules = [...modules].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    return Promise.resolve(sortedModules);
};


export const updateModule = async (courseId: string, moduleId: string, updates: Partial<Module>): Promise<void> => {
    if (modulesByCourseId[courseId]) {
        modulesByCourseId[courseId] = modulesByCourseId[courseId].map(m => m.id === moduleId ? { ...m, ...updates } : m);
    }
    return Promise.resolve();
};


export const deleteModule = async (courseId: string, moduleId: string): Promise<string[]> => {
    const course = courses.find(c => c.id === courseId);
    if (!course) throw new Error("Course not found");

    if (modulesByCourseId[courseId]) {
        modulesByCourseId[courseId] = modulesByCourseId[courseId].filter(m => m.id !== moduleId);
    }
    delete lessonsByModuleId[moduleId];
    course.modulesOrder = course.modulesOrder.filter(id => id !== moduleId);

    return Promise.resolve(course.modulesOrder);
};

// --- Lesson Functions ---

export const addLesson = async (
    courseId: string,
    moduleId: string,
    title: string,
    contentType: LessonContentType,
    content: LessonContent
): Promise<{ lessonId: string, updatedLessonsOrder: string[] }> => {
    const newLesson: Lesson = {
        id: nanoid(),
        title,
        contentType,
        content,
    };
    
    lessonsByModuleId[moduleId] = [...(lessonsByModuleId[moduleId] || []), newLesson];
    
    const module = modulesByCourseId[courseId]?.find(m => m.id === moduleId);
    if (module) {
        module.lessonsOrder.push(newLesson.id);
        return Promise.resolve({ lessonId: newLesson.id, updatedLessonsOrder: module.lessonsOrder });
    }
    
    throw new Error('Module not found');
};

export const getLessons = async (courseId: string, moduleId: string, lessonsOrderFromModule?: string[]): Promise<Lesson[]> => {
    const lessons = lessonsByModuleId[moduleId] || [];
    const order = lessonsOrderFromModule || modulesByCourseId[courseId]?.find(m => m.id === moduleId)?.lessonsOrder || [];
    
    const sortedLessons = [...lessons].sort((a,b) => order.indexOf(a.id) - order.indexOf(b.id));
    return Promise.resolve(sortedLessons);
};

export const updateLesson = async (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> => {
    if (lessonsByModuleId[moduleId]) {
        lessonsByModuleId[moduleId] = lessonsByModuleId[moduleId].map(l => l.id === lessonId ? { ...l, ...updates } : l);
    }
    return Promise.resolve();
};

export const deleteLesson = async (courseId: string, moduleId: string, lessonId: string): Promise<string[]> => {
    if (lessonsByModuleId[moduleId]) {
        lessonsByModuleId[moduleId] = lessonsByModuleId[moduleId].filter(l => l.id !== lessonId);
    }
    const module = modulesByCourseId[courseId]?.find(m => m.id === moduleId);
    if (module) {
        module.lessonsOrder = module.lessonsOrder.filter(id => id !== lessonId);
        return Promise.resolve(module.lessonsOrder);
    }
    return Promise.resolve([]);
};

export const updateModulesOrder = async (courseId: string, newOrder: string[]): Promise<void> => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        course.modulesOrder = newOrder;
    }
    return Promise.resolve();
};

export const updateLessonsOrder = async (courseId: string, moduleId: string, newOrder: string[]): Promise<void> => {
    const module = modulesByCourseId[courseId]?.find(m => m.id === moduleId);
    if (module) {
        module.lessonsOrder = newOrder;
    }
    return Promise.resolve();
};
