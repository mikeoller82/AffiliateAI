
import type { Component } from './builder-types';
import { defaultContent } from './default-content';

const defaultBlogPost: Component[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'My Awesome Blog' } },
    { id: Date.now() + 2, type: 'text', content: { text: '# Your Blog Post Title Goes Here' } },
    { id: Date.now() + 3, type: 'image', content: { ...defaultContent.image, alt: 'Blog post featured image' } },
    { id: Date.now() + 4, type: 'text', content: { text: 'Start writing your amazing blog post here. You can use Markdown for formatting, like **bold** text, *italics*, and [links](https://example.com).' } },
    { id: Date.now() + 5, type: 'authorBox', content: defaultContent.authorBox },
    { id: Date.now() + 6, type: 'footer', content: defaultContent.footer },
];

export const blogTemplates: { [key: string]: Component[] } = {
  'default': defaultBlogPost,
  'how-to-write-great-copy': defaultBlogPost, // You can create specific templates later
  'ai-in-marketing-trends': defaultBlogPost,
};
