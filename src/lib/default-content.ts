
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
    pricing: {
        title: 'Pricing Plans',
        tiers: [
            { title: 'Basic', price: '$19', frequency: '/mo', description: 'For individuals and small teams.', features: ['10 Projects', '5GB Storage', 'Basic Support'], cta: 'Choose Plan' },
            { title: 'Pro', price: '$49', frequency: '/mo', description: 'For growing businesses.', features: ['Unlimited Projects', '50GB Storage', 'Priority Support'], cta: 'Choose Plan', featured: true },
            { title: 'Enterprise', price: 'Contact Us', frequency: '', description: 'For large organizations.', features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integrations'], cta: 'Contact Sales' },
        ]
    },
    faq: {
        title: 'Frequently Asked Questions',
        faqs: [
            { question: 'What is included in the free plan?', answer: 'Our free plan includes access to basic features for up to 5 users. You can create up to 3 projects and get community support.' },
            { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges or credits will be applied.' },
            { question: 'Do you offer a non-profit discount?', answer: 'Yes, we offer a 50% discount for registered non-profit organizations. Please contact our support team with your documentation to apply.' },
        ]
    },
    contact: {
        title: 'Get In Touch',
        description: 'Have a question? Fill out the form below and we\'ll get back to you as soon as possible.',
        formId: null,
    },
    authorBox: {
        name: 'Jane Doe',
        bio: 'Jane is a leading expert in digital marketing with over 10 years of experience.',
        avatarSrc: 'https://placehold.co/100x100.png',
        avatarHint: 'author avatar',
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
        copyright: '© 2025 Your Brand. All rights reserved.',
        links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
        ],
    },
    countdown: {
        title: 'Limited Time Offer Ends In:',
        targetDate: '2025-12-31T23:59:59.000Z',
    },
    socials: {
        title: 'Follow Us On Social Media',
        links: [
            { platform: 'Twitter', url: '#' },
            { platform: 'Facebook', url: '#' },
            { platform: 'Instagram', url: '#' },
        ]
    },
    optinForm: {
        title: 'Subscribe to Our Newsletter',
        description: 'Get the latest news and updates delivered straight to your inbox.',
        cta: 'Subscribe',
        formId: null,
    }
};
