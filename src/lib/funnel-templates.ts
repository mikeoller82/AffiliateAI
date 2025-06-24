
import type { Component } from './builder-types';
import { defaultContent } from './default-content';

export interface FunnelTemplate {
    id: string;
    title: string;
    description: string;
    image: string;
    hint: string;
    stats: { ctr: number; optInRate: number; healthScore: number };
    aiInsight: string;
    components: Component[];
}


const leadMagnetFunnel: Component[] = [
  { id: 1, type: 'header', content: { ...defaultContent.header, title: 'AI Marketing Solutions' } },
  { id: 2, type: 'hero', content: { title: 'Tired of Marketing That Doesn\'t Work? Steal Our AI Playbook.', subtitle: 'Download the free 20-page guide that shows you how to use AI to get more leads and sales, even if you\'re not a tech expert.', cta: 'Get My Free Guide Now' } },
  { id: 3, type: 'image', content: { src: 'https://placehold.co/800x600.png', alt: 'Cover of the AI Marketing playbook', hint: 'ebook download' } },
  { id: 4, type: 'features', content: {
      title: 'Here\'s a Fraction of What You\'ll Discover Inside:',
      features: [
        { title: 'The 3-Minute Blog Post', description: 'Use our prompt formula to generate SEO-optimized articles that actually rank on Google.' },
        { title: 'The "Never-Ending" Email Sequence', description: 'How to nurture leads on autopilot until they are begging to buy from you.' },
        { title: 'The Viral Ad Formula', description: 'Create high-converting ads for Facebook & Google without hiring an expensive copywriter.' },
      ]
    }},
  { id: 5, type: 'text', content: { text: 'Join over 15,000 entrepreneurs who have used this guide to supercharge their marketing. Stop guessing, start growing.' } },
  { id: 6, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 AI Marketing Solutions. All rights reserved.' } }
];

const webinarFunnel: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Client Funnel Secrets' } },
    { id: 2, type: 'hero', content: { title: 'FREE TRAINING: The 3-Step System to Double Your Coaching Clients in 90 Days', subtitle: 'Join us for this exclusive live webinar and discover the proven strategy to attract high-ticket clients without paid ads or complex funnels.', cta: 'Save My FREE Seat!' } },
    { id: 3, type: 'features', content: {
        title: 'In This 60-Minute Training, You Will Learn:',
        features: [
          { title: 'The "Invisible Funnel" Method', description: 'Attract your ideal clients without them ever feeling like they\'re being sold to.' },
          { title: 'The Content Multiplier', description: 'How to turn one piece of content into a week\'s worth of engagement and leads.' },
          { title: 'The Authority Accelerator', description: 'The simple social media trick to become the go-to expert in your niche, fast.' },
        ]
      }},
    { id: 4, type: 'testimonials', content: {
        title: 'What Past Attendees Are Saying',
        testimonials: [
            { quote: 'I signed 3 new clients the week after watching this webinar. The "Invisible Funnel" is a game-changer.', author: 'Sarah J., Business Coach' },
            { quote: 'I was struggling to get leads. After this training, my calendar is booked solid. Unbelievable value.', author: 'Mark P., Financial Consultant' },
        ]
    }},
    { id: 5, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 Client Funnel Secrets. All rights reserved.' } }
];

const productLaunchFunnel: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'LaunchPad' } },
    { id: 2, type: 'hero', content: { title: 'The Last Productivity App You’ll Ever Need.', subtitle: 'LaunchPad is now available for pre-order. Be one of the first 500 to join and get a lifetime 50% discount. This offer ends Friday.', cta: 'Claim My 50% Discount' } },
    { id: 3, type: 'image', content: { src: 'https://placehold.co/1200x600.png', alt: 'LaunchPad app interface', hint: 'product launch' } },
    { id: 4, type: 'features', content: {
        title: 'LaunchPad Isn\'t Just Another To-Do List.',
        features: [
            { title: 'AI-Powered Focus', description: 'Our smart AI analyzes your tasks and tells you exactly what to work on next for maximum impact.' },
            { title: 'Deep Work Mode', description: 'Block out all distractions and enter a state of pure flow with one click.' },
            { title: 'Team Synergy', description: 'Seamlessly collaborate, assign tasks, and track progress without ever leaving the app.' },
        ]
    }},
     { id: 5, type: 'testimonials', content: {
        title: 'Early Adopters Are Raving',
        testimonials: [
            { quote: 'I\'ve tried every productivity app out there. LaunchPad is the first one that actually works with my brain, not against it.', author: 'Alex G., Founder' },
            { quote: 'The AI focus feature alone is worth the price. It\'s like having a personal productivity coach.', author: 'Brenda K., Designer' },
        ]
    }},
    { id: 6, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 LaunchPad. All rights reserved.' } }
];

const consultingFunnel: Component[] = [
    { id: 1, type: 'header', content: { ...defaultContent.header, title: 'Growth Consultants' } },
    { id: 2, type: 'hero', content: { title: 'Stop Wasting Money on Ads. Let\'s Build a Growth Machine.', subtitle: 'Book a complimentary 30-minute Strategy Session, and we\'ll hand you a custom plan to increase your revenue by 20% in the next 90 days. Guaranteed.', cta: 'Book My Free Strategy Session' } },
    { id: 3, type: 'testimonials', content: {
        title: 'Our Clients Get Results',
        testimonials: [
            { quote: 'We were stuck at $10k/month. After our strategy session and implementing their plan, we hit $30k/month in just over 3 months. It\'s a no-brainer.', author: 'CEO of SaaS Co.' },
            { quote: 'I was skeptical about the \'free call\' but walked away with more actionable advice than I\'ve gotten from paid consultants.', author: 'Founder of E-com Brand' },
        ]
    }},
    { id: 4, type: 'text', content: { text: `**Step 1: Book Your Call**
Find a time on our calendar that works for you. We'll ask a few simple questions about your business so we can come prepared.

**Step 2: Get Your Custom Plan**
We'll meet for 30 minutes. We analyze your business live on the call and build your personalized Growth Plan. No fluff, just strategy.

**Step 3: Grow Your Business**
You can take the plan and implement it yourself, or you can choose to work with us to execute it. Either way, the plan is yours to keep.` } },
    { id: 5, type: 'footer', content: { ...defaultContent.footer, copyright: '© 2025 Growth Consultants. All rights reserved.' } }
];


const defaultFunnel: Component[] = [
    { id: 1, type: 'header', content: defaultContent.header },
    { id: 2, type: 'hero', content: defaultContent.hero },
    { id: 3, type: 'image', content: defaultContent.image },
    { id: 4, type: 'features', content: defaultContent.features },
    { id: 5, type: 'testimonials', content: defaultContent.testimonials },
    { id: 6, type: 'footer', content: defaultContent.footer }
];

export const funnelTemplates: FunnelTemplate[] = [
    {
        id: 'lead-magnet-funnel',
        title: 'Lead Magnet Funnel',
        description: 'A classic funnel to capture emails in exchange for a free guide or playbook.',
        image: 'https://placehold.co/600x400.png',
        hint: 'marketing funnel analytics',
        stats: { ctr: 55, optInRate: 32, healthScore: 88 },
        aiInsight: 'The headline is strong. Consider adding a video testimonial to increase trust and boost opt-in rate.',
        components: leadMagnetFunnel
    },
    {
        id: 'webinar-funnel',
        title: 'Webinar Funnel',
        description: 'Promote a live training event and register attendees.',
        image: 'https://placehold.co/600x400.png',
        hint: 'webinar presentation screen',
        stats: { ctr: 42, optInRate: 28, healthScore: 92 },
        aiInsight: 'High health score! Your testimonials are effective. Try adding a countdown timer to create urgency.',
        components: webinarFunnel
    },
    {
        id: 'product-launch-funnel',
        title: 'Product Launch Funnel',
        description: 'Announce a new product and drive pre-orders or sales.',
        image: 'https://placehold.co/600x400.png',
        hint: 'product launch rocket',
        stats: { ctr: 61, optInRate: 18, healthScore: 75 },
        aiInsight: 'Good CTR, but opt-in is low. Clarify the discount offer in the subtitle to improve conversion.',
        components: productLaunchFunnel
    },
    {
        id: 'consulting-funnel',
        title: 'Consulting/Strategy Funnel',
        description: 'Book high-ticket strategy calls with qualified leads.',
        image: 'https://placehold.co/600x400.png',
        hint: 'business strategy meeting',
        stats: { ctr: 38, optInRate: 15, healthScore: 81 },
        aiInsight: 'Testimonials are compelling. Make the "Book My Free Strategy Session" CTA more prominent.',
        components: consultingFunnel
    },
];

export const getFunnelComponentsById = (id: string | undefined): Component[] => {
    if (!id || id === 'default') return defaultFunnel;
    const template = funnelTemplates.find(t => t.id === id);
    return template ? template.components : defaultFunnel;
};
