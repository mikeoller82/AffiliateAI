
import type { Component } from './builder-types';

export interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  instructor: string;
  lessonsCount: number;
  hours: number;
  // components: Component[]; // Future: for course curriculum builder
}

export const courseTemplates: CourseTemplate[] = [
    {
        id: 'ai-for-beginners',
        title: 'AI for Beginners',
        description: 'A comprehensive introduction to artificial intelligence and its practical applications.',
        image: 'https://placehold.co/600x400.png',
        hint: 'artificial intelligence brain',
        instructor: 'Jane Doe',
        lessonsCount: 24,
        hours: 8,
    },
    {
        id: 'affiliate-marketing-masterclass',
        title: 'Affiliate Marketing Masterclass',
        description: 'Learn the secrets to building a profitable affiliate marketing business from scratch.',
        image: 'https://placehold.co/600x400.png',
        hint: 'marketing analytics chart',
        instructor: 'John Smith',
        lessonsCount: 45,
        hours: 15,
    },
    {
        id: 'youtube-creator-academy',
        title: 'YouTube Creator Academy',
        description: 'Go from zero to 100,000 subscribers with this proven blueprint for YouTube success.',
        image: 'https://placehold.co/600x400.png',
        hint: 'youtube play button',
        instructor: 'Alex Johnson',
        lessonsCount: 30,
        hours: 12,
    }
];

export const defaultCourseTemplate: CourseTemplate = {
    id: 'default',
    title: 'New Blank Course',
    description: 'Start creating your new course.',
    image: 'https://placehold.co/600x400.png',
    hint: 'blank canvas',
    instructor: 'You',
    lessonsCount: 0,
    hours: 0,
};

export const getCourseTemplateById = (id: string | undefined): CourseTemplate => {
  if (!id) return defaultCourseTemplate;
  return courseTemplates.find(t => t.id === id) || defaultCourseTemplate;
};
