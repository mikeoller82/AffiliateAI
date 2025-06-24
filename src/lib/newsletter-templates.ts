
import type { Component } from './builder-types';
import { defaultContent } from './default-content';

export interface NewsletterTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  hint: string;
  components: Component[];
}

const defaultNewsletter: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Weekly Insights' } },
    { id: 2, type: 'text', content: { text: '## This Week\'s Big Idea' } },
    { id: 3, type: 'image', content: { ...defaultContent.image, alt: 'Newsletter banner image' } },
    { id: 4, type: 'text', content: { text: 'Here\'s the main content of your newsletter. Keep it engaging and provide value to your readers.' } },
    { id: 5, type: 'button', content: { ...defaultContent.button, text: 'Read More on the Blog' } },
    { id: 6, type: 'socials', content: defaultContent.socials },
    { id: 7, type: 'footer', content: defaultContent.footer },
];

const productLaunchNewsletter: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'ProductLaunch Co.' } },
    { id: 2, type: 'hero', content: { title: 'It\'s Here! The Product You\'ve Been Waiting For', subtitle: 'Our biggest launch of the year is finally live.', cta: 'Shop Now & Get 20% Off'}},
    { id: 3, type: 'countdown', content: defaultContent.countdown },
    { id: 4, type: 'video', content: { ...defaultContent.video, title: 'See It In Action'} },
    { id: 5, type: 'features', content: { title: 'Why You\'ll Love It', features: defaultContent.features.features }},
    { id: 6, type: 'button', content: { ...defaultContent.button, text: 'Claim Your Launch Discount' } },
    { id: 7, type: 'footer', content: defaultContent.footer },
];

const weeklyDigest: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'The Weekly Digest' } },
    { id: 2, type: 'text', content: { text: '## Your Curated Insights for the Week' } },
    { id: 3, type: 'text', content: { text: '### Top Story of the Week\n\A summary of the most important news or article from the past week goes here. Explain why it matters to your audience.' } },
    { id: 4, type: 'button', content: { ...defaultContent.button, text: 'Read the Full Story' } },
    { id: 5, type: 'text', content: { text: '### From the Blog\n\n- [Link to your first blog post](https://example.com)\n- [Link to your second blog post](https://example.com)' } },
    { id: 6, type: 'optinForm', content: { ...defaultContent.optinForm, title: 'Share With a Friend!', description: 'Know someone who would love this newsletter? Share it with them.'} },
    { id: 7, type: 'socials', content: defaultContent.socials },
    { id: 8, type: 'footer', content: defaultContent.footer },
];


export const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: 'default',
    title: 'Blank Newsletter',
    description: 'A clean, standard layout for a newsletter page, including text, image, and social links.',
    image: 'https://placehold.co/600x400.png',
    hint: 'email newsletter design',
    components: defaultNewsletter,
  },
  {
    id: 'product-launch',
    title: 'Product Launch Announcement',
    description: 'Build excitement and drive sales for a new product with a countdown and video.',
    image: 'https://placehold.co/600x400.png',
    hint: 'product launch confetti',
    components: productLaunchNewsletter,
  },
  {
    id: 'weekly-digest',
    title: 'Weekly Digest',
    description: 'Curate the best content for your audience with this clean, link-focused template.',
    image: 'https://placehold.co/600x400.png',
    hint: 'news paper article',
    components: weeklyDigest,
  },
];

export const getNewsletterTemplateById = (id: string | undefined): NewsletterTemplate => {
  if (!id) return newsletterTemplates[0];
  return newsletterTemplates.find(t => t.id === id) || newsletterTemplates[0];
}

    