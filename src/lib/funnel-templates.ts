
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
  { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Ebook Experts' } },
  { id: Date.now() + 2, type: 'hero', content: { title: 'Get Your Free Guide to AI Marketing', subtitle: 'Unlock the secrets to growing your business with artificial intelligence.', cta: 'Download Now for Free' } },
  { id: Date.now() + 3, type: 'image', content: { src: 'https://placehold.co/800x600.png', alt: 'Cover of the AI Marketing guide', hint: 'ebook download' } },
  { id: Date.now() + 4, type: 'features', content: {
      title: 'What You\'ll Learn Inside',
      features: [
        { title: 'AI-Powered Content Creation', description: 'Generate high-quality blog posts and social media updates in minutes.' },
        { title: 'Automated Lead Nurturing', description: 'Set up email sequences that convert leads on autopilot.' },
        { title: 'Personalization at Scale', description: 'Deliver unique experiences to every visitor on your website.' },
      ]
    }},
  { id: Date.now() + 5, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} Ebook Experts. All rights reserved.` } }
];

const webinarFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Webinar Pro' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'Live Webinar: Supercharge Your Sales Funnel', subtitle: 'Join us for a free, live training where we reveal the 3 secrets to doubling your conversion rate.', cta: 'Register Your Spot Now' } },
    { id: Date.now() + 3, type: 'video', content: { title: 'A Sneak Peek of What You\'ll Learn', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' } },
    { id: Date.now() + 4, type: 'testimonials', content: {
        title: 'What Past Attendees Are Saying',
        testimonials: [
            { quote: 'This webinar completely changed how I approach my marketing.', author: 'John D.' },
            { quote: 'The value provided was insane for a free event. Highly recommended!', author: 'Jane S.' },
        ]
    }},
    { id: Date.now() + 5, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} Webinar Pro. All rights reserved.` } }
];

const productLaunchFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'LaunchPad' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'The Future of Productivity is Here', subtitle: 'Introducing LaunchPad, the ultimate tool to organize your life and work. Pre-order now and get 50% off.', cta: 'Pre-Order Now & Save' } },
    { id: Date.now() + 3, type: 'image', content: { src: 'https://placehold.co/1200x600.png', alt: 'LaunchPad app interface', hint: 'product launch' } },
    { id: Date.now() + 4, type: 'features', content: {
        title: 'Everything You Need, All in One Place',
        features: [
            { title: 'Smart Task Management', description: 'AI-powered task prioritization to keep you focused.' },
            { title: 'Collaborative Docs', description: 'Work with your team in real-time on shared documents.' },
            { title: 'Seamless Integrations', description: 'Connects with all your favorite tools and apps.' },
        ]
    }},
    { id: Date.now() + 5, type: 'footer', content: { ...defaultContent.footer, copyright: `© ${new Date().getFullYear()} LaunchPad. All rights reserved.` } }
];

const consultingFunnel: FunnelComponent[] = [
    { id: Date.now() + 1, type: 'header', content: { ...defaultContent.header, title: 'Growth Consultants' } },
    { id: Date.now() + 2, type: 'hero', content: { title: 'Ready to Scale Your Business?', subtitle: 'Book a free strategy call with our expert consultants and get a custom-tailored growth plan.', cta: 'Book Your Free Call' } },
    { id: Date.now() + 3, type: 'testimonials', content: {
        title: 'Our Clients Get Results',
        testimonials: [
            { quote: 'We doubled our revenue in 6 months after working with them.', author: 'CEO of Startup Inc.' },
            { quote: 'Their insights were invaluable. A true partner in our growth.', author: 'Founder of Tech LLC' },
        ]
    }},
    { id: Date.now() + 4, type: 'text', content: { text: 'Stop guessing and start growing. Our proven framework has helped businesses just like yours achieve predictable, sustainable growth. During your free call, we\'ll analyze your current strategy and identify the top 3 opportunities for immediate impact. There\'s no obligation—just pure value.' } },
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
