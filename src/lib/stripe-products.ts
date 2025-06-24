export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    frequency: string;
    priceId: string;
    features: string[];
}

// NOTE: You must replace these placeholder IDs with your actual Product and Price IDs from your Stripe dashboard.
// You can find them in the Stripe dashboard under Products.
const products: Product[] = [
    {
        id: 'prod_placeholder_pro',
        name: 'Pro Plan',
        description: 'For power users who need more.',
        price: 29,
        frequency: '/ month',
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1PPr7YRxG2zQp1FpA1B2C3D4', // Replace with your actual Price ID
        features: [
            'Unlimited Funnels & Websites',
            'Unlimited Contacts & Automations',
            'Full AI Tools Access',
            'Team Collaboration',
            'Remove HighLaunchPad Branding',
        ],
    },
    {
        id: 'prod_placeholder_free',
        name: 'Free Plan',
        description: 'For individuals starting out.',
        price: 0,
        frequency: '/ month',
        priceId: 'free_plan', // This is not a real Stripe price
        features: [
            '1 Funnel & 1 Website',
            'Up to 500 Contacts',
            'Limited AI Tool Usage',
            'HighLaunchPad Branding',
        ],
    }
];

export { products };
