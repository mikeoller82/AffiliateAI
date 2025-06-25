// src/lib/firebase-course-api.ts
import {
  Course,
  Module,
  Lesson,
  // FirestoreTimestamp // We'll need the actual Firebase Timestamp type here
} from './course-types';
// We'll also need Firebase app instance and Firestore db instance
// import { db, auth } from './firebase'; // Assuming firebase.ts setup
// import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';

// Placeholder for current user ID - in a real app, this comes from your auth context
const getCurrentUserId = (): string | null => {
  // return auth.currentUser?.uid || null;
  console.warn("Using mock user ID. Replace with actual auth logic.");
  return 'mock-user-id';
};

// Placeholder for Firestore Timestamp - in a real app, this comes from 'firebase/firestore'
const serverTimestampPlaceholder = () => {
    console.warn("Using placeholder server timestamp. Replace with actual Firebase serverTimestamp.");
    return new Date(); // In a real scenario, this would be the Firebase ServerValue.TIMESTAMP or serverTimestamp() function
};

// --- Course Functions ---

export const createCourse = async (
  title: string,
  description?: string,
  template?: Partial<Course> // Optional template to base the course on
): Promise<string /* new courseId */> => {
  const instructorId = getCurrentUserId();
  if (!instructorId) throw new Error('User not authenticated');

  console.log('Attempting to create course:', title, description, template);
  // const courseRef = collection(db, 'courses');
  // const newCourseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: any, updatedAt?: any } = {
  //   title,
  //   description: description || '',
  //   instructorId,
  //   thumbnailUrl: template?.thumbnailUrl || '',
  //   isPublished: false,
  //   modulesOrder: template?.modulesOrder || [],
  //   // modules: template?.modules || [], // if modules were nested
  // };
  // const docRef = await addDoc(courseRef, {
  //   ...newCourseData,
  //   createdAt: serverTimestamp(),
  //   updatedAt: serverTimestamp(),
  // });
  // return docRef.id;
  const mockId = `course-${Date.now()}`;
  console.log(`Mock created course with ID: ${mockId}`);
  return mockId;
};

export const getUserCourses = async (): Promise<Course[]> => {
  const instructorId = getCurrentUserId();
  if (!instructorId) {
    console.log('No user ID, returning empty courses list.');
    return [];
  }

  console.log('Attempting to get courses for user:', instructorId);
  // const coursesRef = collection(db, 'courses');
  // const q = query(coursesRef, where('instructorId', '==', instructorId), orderBy('createdAt', 'desc'));
  // const querySnapshot = await getDocs(q);
  // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  console.log('Returning mock course list.');
  return [
    // { id: 'mock-course-1', title: 'My First Mock Course', instructorId, isPublished: false, modulesOrder: ['mod1'], createdAt: serverTimestampPlaceholder() as any, updatedAt: serverTimestampPlaceholder() as any, description: 'Test desc' },
    // { id: 'mock-course-2', title: 'Another Awesome Mock Course', instructorId, isPublished: true, modulesOrder: [], createdAt: serverTimestampPlaceholder() as any, updatedAt: serverTimestampPlaceholder() as any, description: 'Test desc 2' }
  ]; // Mock data
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  console.log('Attempting to get course:', courseId);
  // const courseRef = doc(db, 'courses', courseId);
  // const docSnap = await getDoc(courseRef);
  // if (docSnap.exists()) {
  //   return { id: docSnap.id, ...docSnap.data() } as Course;
  // }
  console.log(`Returning mock course data for ID: ${courseId}`);
  if (courseId.startsWith('course-')) {
    return {
        id: courseId,
        title: `Mock Course: ${courseId}`,
        instructorId: 'mock-user-id',
        isPublished: false,
        modulesOrder: ['mod-1', 'mod-2'],
        createdAt: serverTimestampPlaceholder() as any,
        updatedAt: serverTimestampPlaceholder() as any,
        description: `This is a mock description for ${courseId}.`
    };
  }
  return null;
};

export const updateCourse = async (courseId: string, updates: Partial<Course>): Promise<void> => {
  console.log('Attempting to update course:', courseId, updates);
  // const courseRef = doc(db, 'courses', courseId);
  // await updateDoc(courseRef, { ...updates, updatedAt: serverTimestamp() });
  console.log(`Mock updated course ${courseId}.`);
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  console.log('Attempting to delete course:', courseId);
  // const courseRef = doc(db, 'courses', courseId);
  // await deleteDoc(courseRef);
  // TODO: Need to delete subcollections (modules, lessons) as well, typically via a Firebase Function for atomicity and completeness.
  console.log(`Mock deleted course ${courseId}. Note: Subcollections (modules, lessons) would need separate deletion logic.`);
};

// --- Module Functions ---

export const addModule = async (courseId: string, title: string, description?: string): Promise<{moduleId: string, updatedModulesOrder: string[]}> => {
  console.log('Attempting to add module to course:', courseId, title, description);
  // const modulesRef = collection(db, 'courses', courseId, 'modules');
  // const newModuleData = {
  //   title,
  //   description: description || '',
  //   lessonsOrder: [],
  // };
  // const docRef = await addDoc(modulesRef, newModuleData);

  // // Update course's modulesOrder
  // const courseRef = doc(db, 'courses', courseId);
  // const courseSnap = await getDoc(courseRef);
  // let updatedModulesOrder: string[] = [];
  // if (courseSnap.exists()) {
  //   const courseData = courseSnap.data() as Course;
  //   updatedModulesOrder = [...(courseData.modulesOrder || []), docRef.id];
  //   await updateDoc(courseRef, {
  //     modulesOrder: updatedModulesOrder,
  //     updatedAt: serverTimestamp()
  //   });
  // }
  // return { moduleId: docRef.id, updatedModulesOrder };
  const mockModuleId = `mod-${Date.now()}`;
  const mockOrder = [mockModuleId]; // Simplified for mock
  console.log(`Mock added module ${mockModuleId} to course ${courseId}.`);
  return { moduleId: mockModuleId, updatedModulesOrder: mockOrder};
};

export const getModules = async (courseId: string, modulesOrderFromCourse?: string[]): Promise<Module[]> => {
  console.log('Attempting to get modules for course:', courseId);
  // const modulesRef = collection(db, 'courses', courseId, 'modules');
  // let finalModulesOrder = modulesOrderFromCourse;

  // if (!finalModulesOrder) {
  //   const courseSnap = await getDoc(doc(db, 'courses', courseId));
  //   if (!courseSnap.exists()) return [];
  //   const courseData = courseSnap.data() as Course;
  //   finalModulesOrder = courseData.modulesOrder || [];
  // }

  // const moduleDocs = await getDocs(modulesRef);
  // const modules = moduleDocs.docs.map(d => ({id: d.id, ...d.data()}) as Module);

  // modules.sort((a, b) => (finalModulesOrder?.indexOf(a.id) ?? -1) - (finalModulesOrder?.indexOf(b.id) ?? -1));
  // return modules;
  console.log(`Returning mock modules for course ${courseId}.`);
    if (courseId.startsWith('course-')) {
        return [
            { id: 'mod-1', title: 'Module 1: Introduction', lessonsOrder: ['lesson-1a', 'lesson-1b'], description: 'First module' },
            { id: 'mod-2', title: 'Module 2: Deep Dive', lessonsOrder: ['lesson-2a'], description: 'Second module' },
        ];
    }
  return []; // Mock data
};

export const updateModule = async (courseId: string, moduleId: string, updates: Partial<Module>): Promise<void> => {
  console.log('Attempting to update module:', moduleId, 'in course:', courseId, updates);
  // const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
  // await updateDoc(moduleRef, updates);
  // const courseDocRef = doc(db, 'courses', courseId);
  // await updateDoc(courseDocRef, { updatedAt: serverTimestamp() });
  console.log(`Mock updated module ${moduleId}.`);
};

export const deleteModule = async (courseId: string, moduleId: string): Promise<string[]> => {
  console.log('Attempting to delete module:', moduleId, 'from course:', courseId);
  // const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
  // await deleteDoc(moduleRef);

  // let updatedModulesOrder: string[] = [];
  // const courseRef = doc(db, 'courses', courseId);
  // const courseSnap = await getDoc(courseRef);
  // if (courseSnap.exists()) {
  //   const courseData = courseSnap.data() as Course;
  //   updatedModulesOrder = courseData.modulesOrder.filter(id => id !== moduleId);
  //   await updateDoc(courseRef, {
  //     modulesOrder: updatedModulesOrder,
  //     updatedAt: serverTimestamp()
  //   });
  // }
  // TODO: Delete lessons subcollection for this module (Firebase Function recommended).
  console.log(`Mock deleted module ${moduleId}. Sub-lessons would need separate deletion.`);
  return []; // Return mock updated order
};

// --- Lesson Functions ---

export const addLesson = async (
    courseId: string,
    moduleId: string,
    title: string,
    contentType: Lesson['contentType'],
    content: Lesson['content']
): Promise<{lessonId: string, updatedLessonsOrder: string[]}> => {
  console.log('Attempting to add lesson to module:', moduleId, 'in course:', courseId, title);
  // const lessonsRef = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
  // const newLessonData: Omit<Lesson, 'id'> = {
  //   title,
  //   contentType,
  //   content,
  //   estimatedDurationMinutes: 0,
  // };
  // const docRef = await addDoc(lessonsRef, newLessonData);

  // let updatedLessonsOrder: string[] = [];
  // const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
  // const moduleSnap = await getDoc(moduleRef);
  // if (moduleSnap.exists()) {
  //   const moduleData = moduleSnap.data() as Module;
  //   updatedLessonsOrder = [...(moduleData.lessonsOrder || []), docRef.id];
  //   await updateDoc(moduleRef, { lessonsOrder: updatedLessonsOrder });
  // }
  // const courseDocRef = doc(db, 'courses', courseId);
  // await updateDoc(courseDocRef, { updatedAt: serverTimestamp() });
  // return { lessonId: docRef.id, updatedLessonsOrder };
  const mockLessonId = `lesson-${Date.now()}`;
  const mockOrder = [mockLessonId]; // Simplified
  console.log(`Mock added lesson ${mockLessonId} to module ${moduleId}.`);
  return { lessonId: mockLessonId, updatedLessonsOrder: mockOrder };
};

export const getLessons = async (courseId: string, moduleId: string, lessonsOrderFromModule?: string[]): Promise<Lesson[]> => {
  console.log('Attempting to get lessons for module:', moduleId, 'in course:', courseId);
  // const lessonsRef = collection(db, 'courses', courseId, 'modules', moduleId, 'lessons');
  // let finalLessonsOrder = lessonsOrderFromModule;

  // if(!finalLessonsOrder) {
  //   const moduleSnap = await getDoc(doc(db, 'courses', courseId, 'modules', moduleId));
  //   if (!moduleSnap.exists()) return [];
  //   const moduleData = moduleSnap.data() as Module;
  //   finalLessonsOrder = moduleData.lessonsOrder || [];
  // }

  // const lessonDocs = await getDocs(lessonsRef);
  // const lessons = lessonDocs.docs.map(d => ({id: d.id, ...d.data()}) as Lesson);

  // lessons.sort((a,b) => (finalLessonsOrder?.indexOf(a.id) ?? -1) - (finalLessonsOrder?.indexOf(b.id) ?? -1));
  // return lessons;
  console.log(`Returning mock lessons for module ${moduleId}.`);
    if (moduleId === 'mod-1') {
        return [
            { id: 'lesson-1a', title: 'Lesson 1A: Basics', contentType: 'text' as any, content: { text: 'Hello world' } },
            { id: 'lesson-1b', title: 'Lesson 1B: Advanced', contentType: 'video' as any, content: { videoUrl: 'https://youtube.com/example' } },
        ];
    }
    if (moduleId === 'mod-2') {
        return [
            { id: 'lesson-2a', title: 'Lesson 2A: Case Study', contentType: 'text' as any, content: { text: 'A case study...' } },
        ];
    }
  return [];
};

export const updateLesson = async (courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>): Promise<void> => {
  console.log('Attempting to update lesson:', lessonId, 'in module:', moduleId, 'course:', courseId, updates);
  // const lessonRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
  // await updateDoc(lessonRef, updates);
  // const courseDocRef = doc(db, 'courses', courseId);
  // await updateDoc(courseDocRef, { updatedAt: serverTimestamp() });
  console.log(`Mock updated lesson ${lessonId}.`);
};

export const deleteLesson = async (courseId: string, moduleId: string, lessonId: string): Promise<string[]> => {
  console.log('Attempting to delete lesson:', lessonId, 'from module:', moduleId, 'course:', courseId);
  // const lessonRef = doc(db, 'courses', courseId, 'modules', moduleId, 'lessons', lessonId);
  // await deleteDoc(lessonRef);

  // let updatedLessonsOrder: string[] = [];
  // const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
  // const moduleSnap = await getDoc(moduleRef);
  // if (moduleSnap.exists()) {
  //   const moduleData = moduleSnap.data() as Module;
  //   updatedLessonsOrder = moduleData.lessonsOrder.filter(id => id !== lessonId);
  //   await updateDoc(moduleRef, { lessonsOrder: updatedLessonsOrder });
  // }
  // const courseDocRef = doc(db, 'courses', courseId);
  // await updateDoc(courseDocRef, { updatedAt: serverTimestamp() });
  // return updatedLessonsOrder;
  console.log(`Mock deleted lesson ${lessonId}.`);
  return []; // Return mock updated order
};

// --- Helper for updating order arrays ---
export const updateModulesOrder = async (courseId: string, newOrder: string[]): Promise<void> => {
  console.log('Updating modules order for course:', courseId, newOrder);
  // const courseRef = doc(db, 'courses', courseId);
  // await updateDoc(courseRef, { modulesOrder: newOrder, updatedAt: serverTimestamp() });
  console.log(`Mock updated modules order for course ${courseId}.`);
};

export const updateLessonsOrder = async (courseId: string, moduleId: string, newOrder: string[]): Promise<void> => {
  console.log('Updating lessons order for module:', moduleId, newOrder);
  // const moduleRef = doc(db, 'courses', courseId, 'modules', moduleId);
  // await updateDoc(moduleRef, { lessonsOrder: newOrder });
  // const courseDocRef = doc(db, 'courses', courseId);
  // await updateDoc(courseDocRef, { updatedAt: serverTimestamp() });
  console.log(`Mock updated lessons order for module ${moduleId}.`);
};
