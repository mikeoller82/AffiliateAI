
import type { Component } from './builder-types';
import { defaultContent } from './default-content';

export interface WebsiteTemplate {
    id: string;
    title: string;
    description: string;
    image: string;
    hint: string;
    stats: { visitors: string; leads: number; conversion: string };
    aiInsight: string;
    components: Component[];
}

const serviceBusiness: Component[] = [
  { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Growth Partners' } },
  { id: Date.now() + 2, type: 'hero', content: { title: 'We Help SaaS Companies Scale.', subtitle: 'We\'re a performance marketing agency that drives measurable results for venture-backed SaaS businesses. Stop wasting money, start scaling.', cta: 'Book a Free Strategy Call' } },
  { id: Date.now() + 3, type: 'features', content: {
      title: 'What We Do',
      features: [
        { title: 'Paid Acquisition', description: 'Expert management of Google, Facebook, and LinkedIn ad campaigns to drive qualified leads.' },
        { title: 'SEO & Content', description: 'Turn your blog into a lead-generation machine with content that ranks and converts.' },
        { title: 'Conversion Rate Optimization', description: 'We\'ll optimize your landing pages and funnels to turn more visitors into customers.' },
      ]
    }},
  { id: Date.now() + 4, type: 'testimonials', content: { ...defaultContent.testimonials, title: 'Results Our Clients Have Seen' } },
  { id: Date.now() + 5, type: 'pricing', content: {
      title: 'Flexible Plans for Every Stage',
      tiers: [
        { title: 'Audit & Strategy', price: '$5,000', frequency: 'one-time', description: 'A complete audit of your current marketing and a custom 90-day growth plan.', features: ['Full Funnel Audit', 'Competitor Analysis', '90-Day Action Plan'], cta: 'Get Started' },
        { title: 'Growth Retainer', price: '$10,000', frequency: '/mo', description: 'Done-for-you execution of your growth strategy.', features: ['Dedicated Account Manager', 'Paid Ads & SEO Execution', 'Weekly Reporting'], cta: 'Choose Plan', featured: true },
        { title: 'CMO-as-a-Service', price: 'Custom', frequency: '', description: 'Strategic leadership to guide your entire marketing function.', features: ['Everything in Growth', 'Team Training & Hiring', 'Board-Level Reporting'], cta: 'Contact Us' },
      ]
  }},
  { id: Date.now() + 6, type: 'faq', content: defaultContent.faq },
  { id: Date.now() + 7, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} Growth Partners. All rights reserved.` } }
];

const portfolio: Component[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Jane Doe' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'Jane Doe: Product Designer & Developer', subtitle: 'I design and build beautiful, user-centric digital experiences that solve real problems. Currently based in San Francisco.', cta: 'View My Work' } },
    { id: Date.now() + 3, type: 'image', content: { src: 'https://placehold.co/1200x800.png', alt: 'Jane Doe working at her desk', hint: 'designer desk' } },
    { id: Date.now() + 4, type: 'text', content: { text: '### About Me\nI\'m a passionate designer with a knack for code. With over 8 years of experience, I specialize in creating intuitive interfaces for complex applications. My design philosophy is simple: make it useful, make it usable, make it beautiful.' } },
    { id: Date.now() + 5, type: 'testimonials', content: {
        title: 'What People Are Saying',
        testimonials: [
            { quote: 'Jane is a rare talent. She has the design sense of an artist and the logical mind of an engineer. A huge asset to any team.', author: 'CEO, Innovate Inc.' },
            { quote: 'The user experience she designed for our platform reduced churn by 15%. I cannot recommend her highly enough.', author: 'Head of Product, TechCorp' },
        ]
    }},
    { id: Date.now() + 6, type: 'contact', content: { ...defaultContent.contact, title: 'Let\'s build something great together.', description: 'I\'m currently available for freelance projects. Send me a message to get started.' } },
    { id: Date.now() + 7, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} Jane Doe. All rights reserved.` } }
];

const defaultWebsite: Component[] = [
    { id: Date.now() + 1, type: 'header', content: defaultContent.header },
    { id: Date.now() + 2, type: 'hero', content: defaultContent.hero },
    { id: Date.now() + 3, type: 'features', content: defaultContent.features },
    { id: Date.now() + 4, type: 'pricing', content: defaultContent.pricing },
    { id: Date.now() + 5, type: 'faq', content: defaultContent.faq },
    { id: Date.now() + 6, type: 'footer', content: defaultContent.footer }
];


export const websiteTemplates: WebsiteTemplate[] = [
  {
      id: 'service-business',
      title: 'Service Business',
      description: 'A professional template for agencies, consultants, or service providers.',
      image: 'https://placehold.co/600x400.png',
      hint: 'modern office teamwork',
      stats: { visitors: '1.2k', leads: 48, conversion: '4.0%' },
      aiInsight: 'The pricing tiers are clear. Consider adding a "Case Studies" section to build more social proof.',
      components: serviceBusiness,
  },
  {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your work and skills with this clean, modern portfolio template.',
      image: 'https://placehold.co/600x400.png',
      hint: 'designer portfolio website',
      stats: { visitors: '840', leads: 12, conversion: '1.4%' },
      aiInsight: 'Your testimonials are strong. Make the "Contact" call-to-action more visible higher up the page.',
      components: portfolio,
  }
];

export const getWebsiteComponentsById = (id: string | undefined): Component[] => {
    if (!id || id === 'default') return defaultWebsite;
    const template = websiteTemplates.find(t => t.id === id);
    return template ? template.components : defaultWebsite;
};
