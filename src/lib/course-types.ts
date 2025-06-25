
// src/lib/course-types.ts

// A simplified Timestamp that matches what Firestore returns, but can be created locally.
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export enum LessonContentType {
  TEXT = 'text',
  VIDEO = 'video',
  QUIZ = 'quiz', // Placeholder for future
  DOCUMENT = 'document', // Placeholder for future
}

export interface LessonContent {
  // Define specific structures for each content type
  text?: string; // For LessonContentType.TEXT
  videoUrl?: string; // For LessonContentType.VIDEO (e.g., YouTube, Vimeo URL)
  // quizId?: string; // For LessonContentType.QUIZ
  // documentUrl?: string; // For LessonContentType.DOCUMENT
}

export interface Lesson {
  id: string; // Firestore document ID
  title: string;
  contentType: LessonContentType;
  content: LessonContent;
  estimatedDurationMinutes?: number;
  // courseId and moduleId will be implicit from its location in Firestore
  // but can be useful to store if denormalizing or for specific queries.
  // For now, we assume they are derived from the Firestore path.
}

export interface Module {
  id: string; // Firestore document ID
  title:string;
  description?: string;
  lessonsOrder: string[]; // Array of lesson IDs to maintain order
  // courseId will be implicit from its location in Firestore
}

export interface Course {
  id: string; // Firestore document ID
  title: string;
  description?: string;
  instructorId: string; // Firebase User UID
  thumbnailUrl?: string;
  isPublished: boolean;
  modulesOrder: string[]; // Array of module IDs to maintain order
  createdAt: FirestoreTimestamp; 
  updatedAt: FirestoreTimestamp; 
}

// Example of how you might structure data in Firestore:
// /courses/{courseId} (document with Course data, excluding modules themselves)
// /courses/{courseId}/modules/{moduleId} (document with Module data, excluding lessons themselves)
// /courses/{courseId}/modules/{moduleId}/lessons/{lessonId} (document with Lesson data)
