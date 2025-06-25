
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
  { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Growth Partners' } },
  { id: 2, type: 'hero', content: { title: 'We Help SaaS Companies Scale.', subtitle: 'We\'re a performance marketing agency that drives measurable results for venture-backed SaaS businesses. Stop wasting money, start scaling.', cta: 'Book a Free Strategy Call' } },
  { id: 3, type: 'features', content: {
      title: 'What We Do',
      features: [
        { title: 'Paid Acquisition', description: 'Expert management of Google, Facebook, and LinkedIn ad campaigns to drive qualified leads.' },
        { title: 'SEO & Content', description: 'Turn your blog into a lead-generation machine with content that ranks and converts.' },
        { title: 'Conversion Rate Optimization', description: 'We\'ll optimize your landing pages and funnels to turn more visitors into customers.' },
      ]
    }},
  { id: 4, type: 'testimonials', content: { ...defaultContent.testimonials, title: 'Results Our Clients Have Seen' } },
  { id: 5, type: 'pricing', content: {
      title: 'Flexible Plans for Every Stage',
      tiers: [
        { title: 'Audit & Strategy', price: '$5,000', frequency: 'one-time', description: 'A complete audit of your current marketing and a custom 90-day growth plan.', features: ['Full Funnel Audit', 'Competitor Analysis', '90-Day Action Plan'], cta: 'Get Started' },
        { title: 'Growth Retainer', price: '$10,000', frequency: '/mo', description: 'Done-for-you execution of your growth strategy.', features: ['Dedicated Account Manager', 'Paid Ads & SEO Execution', 'Weekly Reporting'], cta: 'Choose Plan', featured: true },
        { title: 'CMO-as-a-Service', price: 'Custom', frequency: '', description: 'Strategic leadership to guide your entire marketing function.', features: ['Everything in Growth', 'Team Training & Hiring', 'Board-Level Reporting'], cta: 'Contact Us' },
      ]
  }},
  { id: 6, type: 'faq', content: defaultContent.faq },
  { id: 7, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 Growth Partners. All rights reserved.' } }
];

const portfolio: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Jane Doe' } },
    { id: 2, type: 'hero', content: { title: 'Jane Doe: Product Designer & Developer', subtitle: 'I design and build beautiful, user-centric digital experiences that solve real problems. Currently based in San Francisco.', cta: 'View My Work' } },
    { id: 3, type: 'image', content: { src: 'https://placehold.co/1200x800.png', alt: 'Jane Doe working at her desk', hint: 'designer desk' } },
    { id: 4, type: 'text', content: { text: '### About Me\nI\'m a passionate designer with a knack for code. With over 8 years of experience, I specialize in creating intuitive interfaces for complex applications. My design philosophy is simple: make it useful, make it usable, make it beautiful.' } },
    { id: 5, type: 'testimonials', content: {
        title: 'What People Are Saying',
        testimonials: [
            { quote: 'Jane is a rare talent. She has the design sense of an artist and the logical mind of an engineer. A huge asset to any team.', author: 'CEO, Innovate Inc.' },
            { quote: 'The user experience she designed for our platform reduced churn by 15%. I cannot recommend her highly enough.', author: 'Head of Product, TechCorp' },
        ]
    }},
    { id: 6, type: 'contact', content: { ...defaultContent.contact, title: 'Let\'s build something great together.', description: 'I\'m currently available for freelance projects. Send me a message to get started.' } },
    { id: 7, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 Jane Doe. All rights reserved.' } }
];

const localRestaurant: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'The Golden Spoon' } },
    { id: 2, type: 'hero', content: { title: 'Authentic Italian Cuisine', subtitle: 'Experience the taste of Italy right here in your city. Fresh ingredients, traditional recipes.', cta: 'View Menu', ctaSecondary: 'Reserve a Table' } },
    { id: 3, type: 'text', content: { text: '### Our Story\nFor over 20 years, The Golden Spoon has been a family-owned establishment dedicated to serving authentic Italian dishes. Our commitment to quality ingredients and time-honored recipes has made us a local favorite.' } },
    { id: 4, type: 'features', content: {
        title: 'Our Specialties',
        features: [
            { title: 'Handmade Pasta', description: 'Fresh pasta made in-house daily.' },
            { title: 'Wood-Fired Pizza', description: 'Crispy, delicious pizzas from our special oven.' },
            { title: 'Fine Wines', description: 'A curated selection of Italian wines.' },
        ]
    }},
    { id: 5, type: 'testimonials', content: { title: 'What Our Customers Say', testimonials: [
        { quote: 'The best pasta I have ever had! A cozy place with a great atmosphere.', author: 'Food Critic' },
        { quote: 'A true gem. The service was excellent and the food was divine.', author: 'Local Guide' },
    ]}},
    { id: 6, type: 'contact', content: { ...defaultContent.contact, title: 'Come Visit Us', description: '123 Pasta Lane, Foodie City | (555) 123-4567 | Open daily 5 PM - 11 PM' } },
    { id: 7, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 The Golden Spoon. All rights reserved.' } }
];

const realEstateAgent: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'John Realty' } },
    { id: 2, type: 'hero', content: { title: 'Your Dream Home Awaits', subtitle: 'John Doe, helping you find the perfect property. Your trusted real estate advisor.', cta: 'Search Properties', ctaSecondary: 'Get a Free Home Valuation' } },
    { id: 3, type: 'image', content: { src: 'https://placehold.co/1200x800.png', alt: 'Real estate agent headshot', hint: 'professional realtor photo' } },
    { id: 4, type: 'text', content: { text: '### About John\nWith over a decade of experience in the local market, I have the expertise to guide you through the buying or selling process. I am committed to getting you the best deal.' } },
    { id: 5, type: 'features', content: {
        title: 'Featured Listings',
        features: [
            { title: 'Sunnyvale Villa', description: '$1,200,000 - 4 bed, 3 bath' },
            { title: 'Downtown Condo', description: '$750,000 - 2 bed, 2 bath' },
            { title: 'Suburban Family Home', description: '$950,000 - 5 bed, 4 bath' },
        ]
    }},
    { id: 6, type: 'testimonials', content: { title: 'What My Clients Say', testimonials: [
        { quote: 'John made the home buying process so easy and stress-free. Highly recommended!', author: 'The Smiths' },
        { quote: 'He sold our house in a week for over the asking price. A true professional.', author: 'The Joneses' },
    ]}},
    { id: 7, type: 'contact', content: { ...defaultContent.contact, title: 'Let\'s Find Your Next Home', description: 'Get in touch for a no-obligation consultation.' } },
    { id: 8, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 John Realty. All rights reserved.' } }
];

const fitnessCoach: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'FitLife Coaching' } },
    { id: 2, type: 'hero', content: { title: 'Transform Your Body, Transform Your Life', subtitle: 'Personalized fitness and nutrition plans to help you achieve your goals.', cta: 'View Programs', ctaSecondary: 'Book a Free Consultation' } },
    { id: 3, type: 'features', content: {
        title: 'My Programs',
        features: [
            { title: '1-on-1 Personal Training', description: 'Tailored workouts and direct coaching.' },
            { title: 'Online Group Coaching', description: 'Join a community and get fit together.' },
            { title: 'Nutritional Planning', description: 'Custom meal plans to complement your training.' },
        ]
    }},
    { id: 4, type: 'testimonials', content: { title: 'Success Stories', testimonials: [
        { quote: 'I lost 50 lbs and have never felt better! The best investment I made in myself.', author: 'Client A' },
        { quote: 'The personalized plan was easy to follow and incredibly effective. I have so much more energy now.', author: 'Client B' },
    ]}},
    { id: 5, type: 'pricing', content: {
      title: 'Choose Your Plan',
      tiers: [
        { title: 'Basic', price: '$99', frequency: '/mo', description: 'Online group coaching and community access.', features: ['Group Workouts', 'Community Forum'], cta: 'Get Started' },
        { title: 'Premium', price: '$299', frequency: '/mo', description: '1-on-1 training and personalized nutrition.', features: ['Personal Workouts', 'Nutrition Plan', 'Weekly Check-ins'], cta: 'Choose Plan', featured: true },
        { title: 'Ultimate', price: '$499', frequency: '/mo', description: 'All-inclusive plan for maximum results.', features: ['Everything in Premium', '24/7 Support'], cta: 'Contact Us' },
      ]
    }},
    { id: 6, type: 'contact', content: { ...defaultContent.contact, title: 'Start Your Fitness Journey Today', description: 'Book a free consultation to discuss your goals.' } },
    { id: 7, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 FitLife Coaching. All rights reserved.' } }
];


const defaultWebsite: Component[] = [
    { id: 1, type: 'header', content: defaultContent.header },
    { id: 2, type: 'hero', content: defaultContent.hero },
    { id: 3, type: 'features', content: defaultContent.features },
    { id: 4, type: 'pricing', content: defaultContent.pricing },
    { id: 5, type: 'faq', content: defaultContent.faq },
    { id: 6, type: 'footer', content: defaultContent.footer }
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
  },
  {
      id: 'local-restaurant',
      title: 'Local Restaurant',
      description: 'A delicious-looking template perfect for any restaurant, cafe, or bar.',
      image: 'https://placehold.co/600x400.png',
      hint: 'cozy italian restaurant interior',
      stats: { visitors: '2.5k', leads: 90, conversion: '3.6%' },
      aiInsight: 'The menu is easy to navigate. Adding online ordering could significantly boost revenue.',
      components: localRestaurant,
  },
  {
      id: 'real-estate-agent',
      title: 'Real Estate Agent',
      description: 'A professional template for real estate agents to showcase listings and generate leads.',
      image: 'https://placehold.co/600x400.png',
      hint: 'modern suburban house exterior',
      stats: { visitors: '3.1k', leads: 120, conversion: '3.9%' },
      aiInsight: 'Featured listings are prominent. A mortgage calculator tool could be a useful addition.',
      components: realEstateAgent,
  },
  {
      id: 'fitness-coach',
      title: 'Fitness Coach',
      description: 'An energetic template for fitness professionals to attract clients and display programs.',
      image: 'https://placehold.co/600x400.png',
      hint: 'energetic fitness class',
      stats: { visitors: '1.8k', leads: 70, conversion: '3.8%' },
      aiInsight: 'Success stories are powerful. Embedding short video testimonials could enhance credibility.',
      components: fitnessCoach,
  }
];

export const getWebsiteComponentsById = (id: string | undefined): Component[] => {
    if (!id || id === 'default') return defaultWebsite;
    const template = websiteTemplates.find(t => t.id === id);
    return template ? template.components : defaultWebsite;
};
