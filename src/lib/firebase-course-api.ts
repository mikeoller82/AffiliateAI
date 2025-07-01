
import { auth } from './firebase';
import {
    getFirestore,
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

// --- Course Functions ---

export const createCourse = async (
    title: string,
    description?: string,
    template?: Partial<Course>
): Promise<string> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');

    const db = getFirestore();
    const coursesCollection = collection(db, 'courses');

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

    const db = getFirestore();
    const coursesCollection = collection(db, 'courses');
    const q = query(coursesCollection, where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Course));
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
    const db = getFirestore();
    const docRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Course;
    }
    return null;
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
    const db = getFirestore();
    const docRef = doc(db, 'courses', courseId);
    await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    const db = getFirestore();
    const batch = writeBatch(db);
    const courseRef = doc(db, 'courses', courseId);
    const modulesCollection = collection(db, `courses/${courseId}/modules`);
    const getLessonsCollection = (moduleId: string) => collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);

    // Delete all lessons and modules within the course
    const modulesSnapshot = await getDocs(modulesCollection);
    for (const moduleDoc of modulesSnapshot.docs) {
        const lessonsSnapshot = await getDocs(getLessonsCollection(moduleDoc.id));
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
    const db = getFirestore();
    const courseRef = doc(db, 'courses', courseId);
    const modulesCollection = collection(db, `courses/${courseId}/modules`);
    const newModuleRef = doc(modulesCollection);
    
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
    const db = getFirestore();
    const modulesCollection = collection(db, `courses/${courseId}/modules`);
    const modulesSnapshot = await getDocs(modulesCollection);
    const modules = modulesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
    
    const order = modulesOrderFromCourse || (await getCourse(courseId))?.modulesOrder || [];
    
    return modules.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const updateModule = async (courseId: string, moduleId: string, updates: Partial<Module>): Promise<void> => {
    const db = getFirestore();
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    await updateDoc(moduleRef, updates);
};

export const deleteModule = async (courseId: string, moduleId: string): Promise<string[]> => {
    const db = getFirestore();
    const courseRef = doc(db, 'courses', courseId);
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    const lessonsCollection = collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);

    // Delete all lessons in the module
    const lessonsSnapshot = await getDocs(lessonsCollection);
    const batch = writeBatch(db);
    lessonsSnapshot.docs.forEach(lessonDoc => batch.delete(lessonDoc.ref));
    batch.delete(moduleRef);
    batch.update(courseRef, { modulesOrder: arrayRemove(moduleId) });
    await batch.commit();

    const updatedCourse = await getCourse(courseId);
    return updatedCourse?.modulesOrder || [];
};

export const updateModulesOrder = async (courseId: string, newOrder: string[]): Promise<void> => {
    const db = getFirestore();
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
    const db = getFirestore();
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    const lessonsCollection = collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);
    const newLessonRef = doc(lessonsCollection);

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
    const db = getFirestore();
    const lessonsCollection = collection(db, `courses/${courseId}/modules/${moduleId}/lessons`);
    const lessonsSnapshot = await getDocs(lessonsCollection);
    const lessons = lessonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));

    let order = lessonsOrderFromModule;
    if (!order) {
        const moduleSnap = await getDoc(doc(db, `courses/${courseId}/modules`, moduleId));
        order = (moduleSnap.data() as Module)?.lessonsOrder || [];
    }
    
    return lessons.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
};

export const updateLesson = async (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> => {
    const db = getFirestore();
    const lessonRef = doc(db, `courses/${courseId}/modules/${moduleId}/lessons`, lessonId);
    await updateDoc(lessonRef, updates);
};

export const deleteLesson = async (courseId: string, moduleId: string, lessonId: string): Promise<string[]> => {
    const db = getFirestore();
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
    const db = getFirestore();
    const moduleRef = doc(db, `courses/${courseId}/modules`, moduleId);
    await updateDoc(moduleRef, { lessonsOrder: newOrder });
};
