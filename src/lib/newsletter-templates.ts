
import type { Component } from './builder-types';
import { defaultContent } from './default-content';

const defaultNewsletter: Component[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Weekly Insights' } },
    { id: Date.now() + 2, type: 'text', content: { text: '# This Week\'s Big Idea' } },
    { id: Date.now() + 3, type: 'image', content: { ...defaultContent.image, alt: 'Newsletter banner image' } },
    { id: Date.now() + 4, type: 'text', content: { text: 'Here\'s the main content of your newsletter. Keep it engaging and provide value to your readers.' } },
    { id: Date.now() + 5, type: 'button', content: { ...defaultContent.button, text: 'Read More on the Blog' } },
    { id: Date.now() + 6, type: 'socials', content: defaultContent.socials },
    { id: Date.now() + 7, type: 'footer', content: defaultContent.footer },
];

const productLaunchNewsletter: Component[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'ProductLaunch Co.' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'It\'s Here! The Product You\'ve Been Waiting For', subtitle: 'Our biggest launch of the year is finally live.', cta: 'Shop Now & Get 20% Off'}},
    { id: Date.now() + 3, type: 'countdown', content: defaultContent.countdown },
    { id: Date.now() + 4, type: 'video', content: defaultContent.video },
    { id: Date.now() + 5, type: 'features', content: { title: 'Why You\'ll Love It', features: defaultContent.features.features }},
    { id: Date.now() + 6, type: 'button', content: { ...defaultContent.button, text: 'Claim Your Launch Discount' } },
    { id: Date.now() + 7, type: 'footer', content: defaultContent.footer },
];

export const newsletterTemplates: { [key: string]: Component[] } = {
  'default': defaultNewsletter,
  'product-update-q2': productLaunchNewsletter,
  'weekly-tips': defaultNewsletter,
};
