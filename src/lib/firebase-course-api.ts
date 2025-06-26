import { db, auth } from './firebase';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    writeBatch,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
    orderBy
} from 'firebase/firestore';
import type { Course, Module, Lesson, LessonContent, LessonContentType, FirestoreTimestamp } from './course-types';
import { nanoid } from 'nanoid';
import { courseTemplates, defaultCourseTemplate } from './course-templates';

// --- Helper to get current user ID ---
const getCurrentUserId = (): string | null => {
    return auth.currentUser?.uid || null;
};

// --- Firestore Collection References ---
const coursesCollection = collection(db, 'courses');
const getModulesCollection = (courseId: string) => collection(db, `courses/${courseId}/modules`);
const getLessonsCollection = (courseId: string, moduleId: string) => collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);

// --- Course Functions ---

export const createCourse = async (
    title: string,
    description?: string,
    template?: Partial<Course>
): Promise<string> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');

    const newCourseData = {
        title: title || defaultCourseTemplate.title,
        description: description || defaultCourseTemplate.description,
        instructorId,
        thumbnailUrl: template?.thumbnailUrl || defaultCourseTemplate.image,
        isPublished: false,
        modulesOrder: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const courseRef = await addDoc(coursesCollection, newCourseData);
    return courseRef.id;
};

export const getUserCourses = async (): Promise<Course[]> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) return [];

    const q = query(coursesCollection, where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Course));
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
    const docRef = doc(db, 'courses', courseId);
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    const batch = writeBatch(db);
    const courseRef = doc(db, 'courses', courseId);

    // Delete all lessons and modules within the course
    const modulesSnapshot = await getDocs(getModulesCollection(courseId));
    for (const moduleDoc of modulesSnapshot.docs) {
        const lessonsSnapshot = await getDocs(getLessonsCollection(courseId, moduleDoc.id));
        lessonsSnapshot.docs.forEach(lessonDoc => {
            batch.delete(lessonDoc.ref);
        });
        batch.delete(moduleDoc.ref);
    }
    
    batch.delete(courseRef);
    await batch.commit();
};

// --- Module Functions ---

export const addModule = async (courseId: string, title: string, description?: string): Promise<{ moduleId: string, updatedModulesOrder: string[] }> => {
    const courseRef = doc(db, 'courses', courseId);
    const newModuleRef = doc(getModulesCollection(courseId));
    
    const newModule: Omit<Module, 'id'> = {
        title,
        description: description || '',
        lessonsOrder: [],
    };

    await writeBatch(db)
        .set(newModuleRef, newModule)
        .update(courseRef, { modulesOrder: arrayUnion(newModuleRef.id) })
        .commit();

    const updatedCourse = await getCourse(courseId);
    return { moduleId: newModuleRef.id, updatedModulesOrder: updatedCourse?.modulesOrder || [] };
};

export const getModules = async (courseId: string, modulesOrderFromCourse?: string[]): Promise<Module[]> => {
    const modulesSnapshot = await getDocs(getModulesCollection(courseId));
    const modules = modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
    
    const order = modulesOrderFromCourse || (await getCourse(courseId))?.modulesOrder || [];
    
    return modules.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const updateModule = async (courseId: string, moduleId: string, updates: Partial<Module>): Promise<void> => {
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    await updateDoc(moduleRef, updates);
};

export const deleteModule = async (courseId: string, moduleId: string): Promise<string[]> => {
    const courseRef = doc(db, 'courses', courseId);
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);

    // Delete all lessons in the module
    const lessonsSnapshot = await getDocs(getLessonsCollection(courseId, moduleId));
    const batch = writeBatch(db);
    lessonsSnapshot.docs.forEach(lessonDoc => batch.delete(lessonDoc.ref));
    batch.delete(moduleRef);
    batch.update(courseRef, { modulesOrder: arrayRemove(moduleId) });
    await batch.commit();

    const updatedCourse = await getCourse(courseId);
    return updatedCourse?.modulesOrder || [];
};

export const updateModulesOrder = async (courseId: string, newOrder: string[]): Promise<void> => {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, { modulesOrder: newOrder });
};


// --- Lesson Functions ---

export const addLesson = async (
    courseId: string,
    moduleId: string,
    title: string,
    contentType: LessonContentType,
    content: LessonContent
): Promise<{ lessonId: string, updatedLessonsOrder: string[] }> => {
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    const newLessonRef = doc(getLessonsCollection(courseId, moduleId));

    const newLesson: Omit<Lesson, 'id'> = {
        title,
        contentType,
        content,
    };

    await writeBatch(db)
        .set(newLessonRef, newLesson)
        .update(moduleRef, { lessonsOrder: arrayUnion(newLessonRef.id) })
        .commit();
        
    const updatedModuleSnap = await getDoc(moduleRef);
    const updatedModule = updatedModuleSnap.data() as Module;

    return { lessonId: newLessonRef.id, updatedLessonsOrder: updatedModule.lessonsOrder || [] };
};

export const getLessons = async (courseId: string, moduleId: string, lessonsOrderFromModule?: string[]): Promise<Lesson[]> => {
    const lessonsSnapshot = await getDocs(getLessonsCollection(courseId, moduleId));
    const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));

    let order = lessonsOrderFromModule;
    if (!order) {
        const moduleSnap = await getDoc(doc(db, `courses/${courseId}/modules`, moduleId));
        order = (moduleSnap.data() as Module)?.lessonsOrder || [];
    }
    
    return lessons.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const updateLesson = async (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> => {
    const lessonRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
    await updateDoc(lessonRef, updates);
};

export const deleteLesson = async (courseId: string, moduleId: string, lessonId: string): Promise<string[]> => {
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    const lessonRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);

    await writeBatch(db)
        .delete(lessonRef)
        .update(moduleRef, { lessonsOrder: arrayRemove(lessonId) })
        .commit();

    const updatedModuleSnap = await getDoc(moduleRef);
    return (updatedModuleSnap.data() as Module)?.lessonsOrder || [];
};

export const updateLessonsOrder = async (courseId: string, moduleId: string, newOrder: string[]): Promise<void> => {
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    await updateDoc(moduleRef, { lessonsOrder: newOrder });
};