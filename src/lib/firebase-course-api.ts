import { db, auth } from '../lib/firebase';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where,
    orderBy,
    arrayUnion,
    arrayRemove,
    writeBatch,
    Timestamp,
} from 'firebase/firestore';
import type {
    Course,
    Module,
    Lesson,
    LessonContent,
    LessonContentType,
    // FirestoreTimestamp // Replaced by Firebase's Timestamp
} from './course-types';

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
    return auth.currentUser?.uid || null;
};

// Helper function to delete all documents in a subcollection
async function deleteSubcollection(parentDocRef: any, subcollectionName: string) {
    const subcollectionRef = collection(parentDocRef, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
}

// --- Course Functions ---

export const createCourse = async (
    title: string,
    description?: string,
    template?: Partial<Course>
): Promise<string> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated to create a course.');

    const coursesCollectionRef = collection(db, 'courses');
    const newCourseData = {
        title,
        description: description || '',
        instructorId,
        thumbnailUrl: template?.thumbnailUrl || '',
        isPublished: false,
        modulesOrder: template?.modulesOrder || [],
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
    };
    const docRef = await addDoc(coursesCollectionRef, newCourseData);
    return docRef.id;
};

export const getUserCourses = async (): Promise<Course[]> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) return [];

    const coursesCollectionRef = collection(db, 'courses');
    const q = query(coursesCollectionRef, where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'));

    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    } catch (error) {
        console.error("Error fetching user courses: ", error);
        return [];
    }
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
    if (!courseId) return null;
    const courseDocRef = doc(db, 'courses', courseId);
    try {
        const docSnap = await getDoc(courseDocRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Course;
        } else {
            console.warn(`Course with ID ${courseId} not found.`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching course ${courseId}: `, error);
        return null;
    }
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated to update course.');
    // Add check: ensure user is the instructor of this course before updating (can be done via security rules too)

    const courseDocRef = doc(db, 'courses', courseId);
    try {
        await updateDoc(courseDocRef, { ...updates, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error(`Error updating course ${courseId}: `, error);
        throw error;
    }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated to delete course.');
    // Add check: ensure user is the instructor of this course

    const courseDocRef = doc(db, 'courses', courseId);
    try {
        // Delete all modules and their lessons first
        const modulesSnapshot = await getDocs(collection(courseDocRef, 'modules'));
        for (const moduleDoc of modulesSnapshot.docs) {
            await deleteSubcollection(moduleDoc.ref, 'lessons'); // Delete lessons in the module
            await deleteDoc(moduleDoc.ref); // Delete the module itself
        }
        // Then delete the course document
        await deleteDoc(courseDocRef);
    } catch (error) {
        console.error(`Error deleting course ${courseId} and its subcollections: `, error);
        throw error;
    }
};

// --- Module Functions ---

export const addModule = async (courseId: string, title: string, description?: string): Promise<{ moduleId: string, updatedModulesOrder: string[] }> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');

    const courseDocRef = doc(db, 'courses', courseId);
    // Optional: Check if current user is instructor of the course
    // const courseSnap = await getDoc(courseDocRef);
    // if (!courseSnap.exists() || courseSnap.data().instructorId !== instructorId) {
    //     throw new Error("User not authorized to add modules to this course.");
    // }

    const modulesCollectionRef = collection(courseDocRef, 'modules');
    const newModuleData = {
        title,
        description: description || '',
        lessonsOrder: [],
        // No createdAt/updatedAt for modules in this model, but can be added
    };
    const moduleDocRef = await addDoc(modulesCollectionRef, newModuleData);

    // Update course's modulesOrder and updatedAt
    await updateDoc(courseDocRef, {
        modulesOrder: arrayUnion(moduleDocRef.id),
        updatedAt: serverTimestamp()
    });

    const updatedCourseSnap = await getDoc(courseDocRef);
    const updatedCourseData = updatedCourseSnap.data() as Course;

    return { moduleId: moduleDocRef.id, updatedModulesOrder: updatedCourseData.modulesOrder || [] };
};

export const getModules = async (courseId: string, modulesOrderFromCourse?: string[]): Promise<Module[]> => {
    const modulesCollectionRef = collection(db, 'courses', courseId, 'modules');
    let finalModulesOrder = modulesOrderFromCourse;

    if (!finalModulesOrder) {
        const courseSnap = await getDoc(doc(db, 'courses', courseId));
        if (!courseSnap.exists()) return [];
        const courseData = courseSnap.data() as Course;
        finalModulesOrder = courseData.modulesOrder || [];
    }

    try {
        const querySnapshot = await getDocs(modulesCollectionRef);
        const modules = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Module));

        // Sort modules based on finalModulesOrder
        modules.sort((a, b) => (finalModulesOrder?.indexOf(a.id) ?? -1) - (finalModulesOrder?.indexOf(b.id) ?? -1));
        return modules;
    } catch (error) {
        console.error(`Error fetching modules for course ${courseId}: `, error);
        return [];
    }
};

export const updateModule = async (courseId: string, moduleId: string, updates: Partial<Module>): Promise<void> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
    // Add instructor check if necessary

    const moduleDocRef = doc(db, 'courses', courseId, 'modules', moduleId);
    try {
        await updateDoc(moduleDocRef, updates);
        // Also update course's updatedAt timestamp
        await updateDoc(doc(db, 'courses', courseId), { updatedAt: serverTimestamp() });
    } catch (error) {
        console.error(`Error updating module ${moduleId} in course ${courseId}: `, error);
        throw error;
    }
};

export const deleteModule = async (courseId: string, moduleId: string): Promise<string[]> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
     // Add instructor check if necessary

    const courseDocRef = doc(db, 'courses', courseId);
    const moduleDocRef = doc(courseDocRef, 'modules', moduleId);

    try {
        // Delete lessons subcollection first
        await deleteSubcollection(moduleDocRef, 'lessons');
        // Then delete the module document
        await deleteDoc(moduleDocRef);

        // Update course's modulesOrder and updatedAt
        await updateDoc(courseDocRef, {
            modulesOrder: arrayRemove(moduleId),
            updatedAt: serverTimestamp()
        });

        const updatedCourseSnap = await getDoc(courseDocRef);
        const updatedCourseData = updatedCourseSnap.data() as Course;
        return updatedCourseData.modulesOrder || [];

    } catch (error) {
        console.error(`Error deleting module ${moduleId} from course ${courseId}: `, error);
        throw error;
    }
};

// --- Lesson Functions ---

export const addLesson = async (
    courseId: string,
    moduleId: string,
    title: string,
    contentType: LessonContentType,
    content: LessonContent
): Promise<{ lessonId: string, updatedLessonsOrder: string[] }> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
    // Add instructor check if necessary

    const moduleDocRef = doc(db, 'courses', courseId, 'modules', moduleId);
    const lessonsCollectionRef = collection(moduleDocRef, 'lessons');

    const newLessonData: Omit<Lesson, 'id'> = { // Ensure this matches the Lesson type excluding id
        title,
        contentType,
        content,
        estimatedDurationMinutes: 0, // Default or pass as param
    };
    const lessonDocRef = await addDoc(lessonsCollectionRef, newLessonData);

    // Update module's lessonsOrder
    await updateDoc(moduleDocRef, {
        lessonsOrder: arrayUnion(lessonDocRef.id)
    });
    // Also update course's updatedAt timestamp
    await updateDoc(doc(db, 'courses', courseId), { updatedAt: serverTimestamp() });

    const updatedModuleSnap = await getDoc(moduleDocRef);
    const updatedModuleData = updatedModuleSnap.data() as Module;

    return { lessonId: lessonDocRef.id, updatedLessonsOrder: updatedModuleData.lessonsOrder || [] };
};

export const getLessons = async (courseId: string, moduleId: string, lessonsOrderFromModule?: string[]): Promise<Lesson[]> => {
    const lessonsCollectionRef = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
    let finalLessonsOrder = lessonsOrderFromModule;

    if (!finalLessonsOrder) {
        const moduleSnap = await getDoc(doc(db, 'courses', courseId, 'modules', moduleId));
        if (!moduleSnap.exists()) return [];
        const moduleData = moduleSnap.data() as Module;
        finalLessonsOrder = moduleData.lessonsOrder || [];
    }

    try {
        const querySnapshot = await getDocs(lessonsCollectionRef);
        const lessons = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lesson));

        lessons.sort((a, b) => (finalLessonsOrder?.indexOf(a.id) ?? -1) - (finalLessonsOrder?.indexOf(b.id) ?? -1));
        return lessons;
    } catch (error) {
        console.error(`Error fetching lessons for module ${moduleId}: `, error);
        return [];
    }
};

export const updateLesson = async (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
    // Add instructor check if necessary

    const lessonDocRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
    try {
        await updateDoc(lessonDocRef, updates);
        // Also update course's updatedAt timestamp
        await updateDoc(doc(db, 'courses', courseId), { updatedAt: serverTimestamp() });
    } catch (error) {
        console.error(`Error updating lesson ${lessonId}: `, error);
        throw error;
    }
};

export const deleteLesson = async (courseId: string, moduleId: string, lessonId: string): Promise<string[]> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
    // Add instructor check if necessary

    const moduleDocRef = doc(db, 'courses', courseId, 'modules', moduleId);
    const lessonDocRef = doc(moduleDocRef, 'lessons', lessonId);

    try {
        await deleteDoc(lessonDocRef);

        // Update module's lessonsOrder
        await updateDoc(moduleDocRef, {
            lessonsOrder: arrayRemove(lessonId)
        });
        // Also update course's updatedAt timestamp
        await updateDoc(doc(db, 'courses', courseId), { updatedAt: serverTimestamp() });

        const updatedModuleSnap = await getDoc(moduleDocRef);
        const updatedModuleData = updatedModuleSnap.data() as Module;
        return updatedModuleData.lessonsOrder || [];

    } catch (error) {
        console.error(`Error deleting lesson ${lessonId}: `, error);
        throw error;
    }
};

// --- Helper for updating order arrays (for drag-and-drop in future) ---
export const updateModulesOrder = async (courseId: string, newOrder: string[]): Promise<void> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
    // Add instructor check

    const courseDocRef = doc(db, 'courses', courseId);
    try {
        await updateDoc(courseDocRef, { modulesOrder: newOrder, updatedAt: serverTimestamp() });
    } catch (error) {
        console.error(`Error updating modules order for course ${courseId}: `, error);
        throw error;
    }
};

export const updateLessonsOrder = async (courseId: string, moduleId: string, newOrder: string[]): Promise<void> => {
    const instructorId = getCurrentUserId();
    if (!instructorId) throw new Error('User not authenticated.');
    // Add instructor check

    const moduleDocRef = doc(db, 'courses', courseId, 'modules', moduleId);
    try {
        await updateDoc(moduleDocRef, { lessonsOrder: newOrder });
        // Also update course's updatedAt timestamp
        await updateDoc(doc(db, 'courses', courseId), { updatedAt: serverTimestamp() });
    } catch (error) {
        console.error(`Error updating lessons order for module ${moduleId}: `, error);
        throw error;
    }
};
