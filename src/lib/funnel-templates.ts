
export type ComponentType = 'hero' | 'features' | 'testimonials' | 'header' | 'footer' | 'image' | 'video' | 'customHtml' | 'text' | 'button';

export interface FunnelComponent {
  id: number;
  type: ComponentType;
  content: any;
}

export const defaultContent = {
    hero: { title: 'Your Big Idea', subtitle: 'A catchy tagline to grab attention.', cta: 'Get Started Now' },
    features: {
        title: 'Amazing Features',
        features: [
            { title: 'Feature One', description: 'Description for feature one.' },
            { title: 'Feature Two', description: 'Description for feature two.' },
            { title: 'Feature Three', description: 'Description for feature three.' },
        ]
    },
    testimonials: {
        title: 'What Our Customers Say',
        testimonials: [
            { quote: 'This is the best product ever!', author: 'Happy Customer' },
            { quote: 'I can\'t believe how much it helped me.', author: 'Another Happy Customer' },
        ]
    },
    header: {
        title: 'Your Brand',
        links: [
            { label: 'Home', href: '#' },
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#' },
        ],
    },
    image: {
        src: 'https://placehold.co/1200x600.png',
        alt: 'Placeholder image',
        hint: 'abstract scenery'
    },
    video: {
        title: 'Watch Our Story',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    text: {
        text: 'This is a block of text. You can edit it to add your own content. You can even use multiple lines.'
    },
    button: {
        text: 'Click Here',
        href: '#',
        variant: 'default',
    },
    customHtml: {
        html: `<div style="padding: 2rem; margin: 1rem; border: 2px dashed #374151; border-radius: 0.5rem; text-align: center; color: #F9FAFB">
    <h3 style="font-size: 1.25rem; font-weight: 600;">Custom HTML Block</h3>
    <p style="margin-top: 0.5rem; opacity: 0.8;">Click the edit icon to add your own HTML.</p>
    <p style="margin-top: 0.25rem; font-size: 0.75rem; opacity: 0.6;">Note: Scripts may not execute in this preview.</p>
</div>`
    },
    footer: {
        copyright: `© ${new Date().getFullYear()} Your Brand. All rights reserved.`,
        links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
        ],
    }
};

const leadMagnetFunnel: FunnelComponent[] = [
  { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'AI Marketing Solutions' } },
  { id: Date.now() + 2, type: 'hero', content: { title: 'Tired of Marketing That Doesn\'t Work? Steal Our AI Playbook.', subtitle: 'Download the free 20-page guide that shows you how to use AI to get more leads and sales, even if you\'re not a tech expert.', cta: 'Get My Free Guide Now' } },
  { id: Date.now() + 3, type: 'image', content: { src: 'https://placehold.co/800x600.png', alt: 'Cover of the AI Marketing playbook', hint: 'ebook download' } },
  { id: Date.now() + 4, type: 'features', content: {
      title: 'Here\'s a Fraction of What You\'ll Discover Inside:',
      features: [
        { title: 'The 3-Minute Blog Post', description: 'Use our prompt formula to generate SEO-optimized articles that actually rank on Google.' },
        { title: 'The "Never-Ending" Email Sequence', description: 'How to nurture leads on autopilot until they are begging to buy from you.' },
        { title: 'The Viral Ad Formula', description: 'Create high-converting ads for Facebook & Google without hiring an expensive copywriter.' },
      ]
    }},
  { id: Date.now() + 5, type: 'text', content: { text: 'Join over 15,000 entrepreneurs who have used this guide to supercharge their marketing. Stop guessing, start growing.' } },
  { id: Date.now() + 6, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} AI Marketing Solutions. All rights reserved.` } }
];

const webinarFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Client Funnel Secrets' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'FREE TRAINING: The 3-Step System to Double Your Coaching Clients in 90 Days', subtitle: 'Join us for this exclusive live webinar and discover the proven strategy to attract high-ticket clients without paid ads or complex funnels.', cta: 'Save My FREE Seat!' } },
    { id: Date.now() + 3, type: 'features', content: {
        title: 'In This 60-Minute Training, You Will Learn:',
        features: [
          { title: 'The "Invisible Funnel" Method', description: 'Attract your ideal clients without them ever feeling like they\'re being sold to.' },
          { title: 'The Content Multiplier', description: 'How to turn one piece of content into a week\'s worth of engagement and leads.' },
          { title: 'The Authority Accelerator', description: 'The simple social media trick to become the go-to expert in your niche, fast.' },
        ]
      }},
    { id: Date.now() + 4, type: 'testimonials', content: {
        title: 'What Past Attendees Are Saying',
        testimonials: [
            { quote: 'I signed 3 new clients the week after watching this webinar. The "Invisible Funnel" is a game-changer.', author: 'Sarah J., Business Coach' },
            { quote: 'I was struggling to get leads. After this training, my calendar is booked solid. Unbelievable value.', author: 'Mark P., Financial Consultant' },
        ]
    }},
    { id: Date.now() + 5, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} Client Funnel Secrets. All rights reserved.` } }
];

const productLaunchFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'LaunchPad' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'The Last Productivity App You’ll Ever Need.', subtitle: 'LaunchPad is now available for pre-order. Be one of the first 500 to join and get a lifetime 50% discount. This offer ends Friday.', cta: 'Claim My 50% Discount' } },
    { id: Date.now() + 3, type: 'image', content: { src: 'https://placehold.co/1200x600.png', alt: 'LaunchPad app interface', hint: 'product launch' } },
    { id: Date.now() + 4, type: 'features', content: {
        title: 'LaunchPad Isn\'t Just Another To-Do List.',
        features: [
            { title: 'AI-Powered Focus', description: 'Our smart AI analyzes your tasks and tells you exactly what to work on next for maximum impact.' },
            { title: 'Deep Work Mode', description: 'Block out all distractions and enter a state of pure flow with one click.' },
            { title: 'Team Synergy', description: 'Seamlessly collaborate, assign tasks, and track progress without ever leaving the app.' },
        ]
    }},
     { id: Date.now() + 5, type: 'testimonials', content: {
        title: 'Early Adopters Are Raving',
        testimonials: [
            { quote: 'I\'ve tried every productivity app out there. LaunchPad is the first one that actually works with my brain, not against it.', author: 'Alex G., Founder' },
            { quote: 'The AI focus feature alone is worth the price. It\'s like having a personal productivity coach.', author: 'Brenda K., Designer' },
        ]
    }},
    { id: Date.now() + 6, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} LaunchPad. All rights reserved.` } }
];

const consultingFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Growth Consultants' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'Stop Wasting Money on Ads. Let\'s Build a Growth Machine.', subtitle: 'Book a complimentary 30-minute Strategy Session, and we\'ll hand you a custom plan to increase your revenue by 20% in the next 90 days. Guaranteed.', cta: 'Book My Free Strategy Session' } },
    { id: Date.now() + 3, type: 'testimonials', content: {
        title: 'Our Clients Get Results',
        testimonials: [
            { quote: 'We were stuck at $10k/month. After our strategy session and implementing their plan, we hit $30k/month in just over 3 months. It\'s a no-brainer.', author: 'CEO of SaaS Co.' },
            { quote: 'I was skeptical about the \'free call\' but walked away with more actionable advice than I\'ve gotten from paid consultants.', author: 'Founder of E-com Brand' },
        ]
    }},
    { id: Date.now() + 4, type: 'text', content: { text: `**Step 1: Book Your Call**
Find a time on our calendar that works for you. We'll ask a few simple questions about your business so we can come prepared.

**Step 2: Get Your Custom Plan**
We'll meet for 30 minutes. We analyze your business live on the call and build your personalized Growth Plan. No fluff, just strategy.

**Step 3: Grow Your Business**
You can take the plan and implement it yourself, or you can choose to work with us to execute it. Either way, the plan is yours to keep.` } },
    { id: Date.now() + 5, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} Growth Consultants. All rights reserved.` } }
];


const defaultFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: defaultContent.header },
    { id: Date.now() + 2, type: 'hero', content: defaultContent.hero },
    { id: Date.now() + 3, type: 'image', content: defaultContent.image },
    { id: Date.now() + 4, type: 'features', content: defaultContent.features },
    { id: Date.now() + 5, type: 'testimonials', content: defaultContent.testimonials },
    { id: Date.now() + 6, type: 'footer', content: defaultContent.footer }
];


export const funnelTemplates: { [key: string]: FunnelComponent[] } = {
  'lead-magnet-funnel': leadMagnetFunnel,
  'webinar-funnel': webinarFunnel,
  'product-launch-funnel': productLaunchFunnel,
  'consulting-funnel': consultingFunnel,
  'default': defaultFunnel
};
