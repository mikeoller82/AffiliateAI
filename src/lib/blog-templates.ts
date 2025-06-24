
import type { Component } from './builder-types';
import { defaultContent } from './default-content';

export interface BlogTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  components: Component[];
}

const defaultBlogPost: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'My Awesome Blog' } },
    { id: 2, type: 'text', content: { text: '## Your Blog Post Title Goes Here' } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'Blog post featured image' } },
    { id: 4, type: 'text', content: { text: 'Start writing your amazing blog post here. You can use Markdown for formatting, like **bold** text, *italics*, and [links](https://example.com).' } },
    { id: 5, type: 'authorBox', content: defaultContent.authorBox },
    { id: 6, type: 'footer', content: defaultContent.footer },
];

const howToGuidePost: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Step-by-Step Guides' } },
    { id: 2, type: 'text', content: { text: '## How to Achieve [Awesome Outcome]' } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'A diagram illustrating the process' } },
    { id: 4, type: 'text', content: { text: '### Step 1: The First Thing to Do\n\nExplain the first step in detail here. Provide context and why it is important.' } },
    { id: 5, type: 'text', content: { text: '### Step 2: The Next Critical Action\n\nNow, walk the user through the second step. Use bullet points for clarity if needed.\n- Point A\n- Point B' } },
    { id: 6, type: 'text', content: { text: '### Step 3: Finishing Up\n\nDescribe the final step and what the result should look like.' } },
    { id: 7, type: 'authorBox', content: defaultContent.authorBox },
    { id: 8, type: 'footer', content: defaultContent.footer },
];

const productReviewPost: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Honest Reviews' } },
    { id: 2, type: 'text', content: { text: '## [Product Name]: An In-Depth Review' } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'The product being reviewed' } },
    { id: 4, type: 'text', content: { text: 'I\'ve spent the last 3 weeks testing out [Product Name]. Here\'s my honest take on whether it\'s worth your money.' } },
    { id: 5, type: 'text', content: { text: '### What I Liked (Pros)\n\n- **Feature 1:** It does this one thing exceptionally well.\n- **Benefit 2:** This saved me a ton of time.\n- **Design:** The user interface is clean and intuitive.' } },
    { id: 6, type: 'text', content: { text: '### What I Disliked (Cons)\n\n- **Limitation 1:** It can be a bit slow on larger projects.\n- **Pricing:** The top-tier plan is quite expensive.' } },
    { id: 7, type: 'text', content: { text: '### The Verdict\n\nSo, should you buy it? If you\'re [Target Audience] looking to [Achieve specific goal], then absolutely. However, if [Alternative need], you might want to look elsewhere.' } },
    { id: 8, type: 'authorBox', content: defaultContent.authorBox },
    { id: 9, type: 'footer', content: defaultContent.footer },
];

export const blogTemplates: BlogTemplate[] = [
    {
        id: 'default',
        title: 'Blank Post',
        description: 'Start with a standard blog post layout, including a header, text, image, and author box.',
        image: 'https://placehold.co/600x400.png',
        hint: 'writing desk',
        components: defaultBlogPost,
    },
    {
        id: 'how-to-guide',
        title: 'How-To Guide',
        description: 'A structured template for writing step-by-step guides, complete with structured headings.',
        image: 'https://placehold.co/600x400.png',
        hint: 'instruction manual',
        components: howToGuidePost,
    },
    {
        id: 'product-review',
        title: 'Product Review',
        description: 'An SEO-optimized template for product reviews, including sections for pros, cons, and a final rating.',
        image: 'https://placehold.co/600x400.png',
        hint: 'product analysis',
        components: productReviewPost,
    }
];

export const getBlogTemplateById = (id: string | undefined): BlogTemplate => {
  if (!id) return blogTemplates[0];
  return blogTemplates.find(t => t.id === id) || blogTemplates[0];
};

    