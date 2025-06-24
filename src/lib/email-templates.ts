
import * as Icons from 'lucide-react';

export interface EmailTemplate {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Icons;
    objective: string;
    tone: string;
    productDetails: string;
}

export const emailTemplates: EmailTemplate[] = [
    {
        id: 'welcome-email',
        title: 'Welcome Email',
        description: 'Onboard new subscribers and introduce them to your brand.',
        icon: 'Sparkles',
        objective: 'Welcome a new subscriber, deliver their initial lead magnet, and introduce them to the brand.',
        tone: 'Friendly',
        productDetails: 'Our brand is [Your Brand Name], and we help [Your Target Audience] to [Achieve Outcome]. The lead magnet they signed up for is [Your Lead Magnet Description]. Mention our core values of [Value 1] and [Value 2].'
    },
    {
        id: 'promo-offer',
        title: 'Promotional Offer',
        description: 'Announce a special discount or limited-time sale to drive revenue.',
        icon: 'BadgePercent',
        objective: 'Announce a limited-time promotional offer for a specific product and encourage immediate purchase.',
        tone: 'Persuasive',
        productDetails: 'The product on sale is [Product Name]. The offer is [Discount, e.g., 25% off]. The offer ends on [Date]. Key benefits of the product are [Benefit 1], [Benefit 2], and [Benefit 3].'
    },
    {
        id: 'webinar-reminder',
        title: 'Webinar Reminder',
        description: 'Remind registered users about an upcoming live event to boost attendance.',
        icon: 'CalendarClock',
        objective: 'Remind registrants about an upcoming webinar, confirm the date/time, and provide the join link.',
        tone: 'Enthusiastic',
        productDetails: 'The webinar topic is "[Webinar Title]". It is happening on [Date] at [Time]. The main host is [Host Name]. The link to join is [Webinar Link].'
    },
    {
        id: 'product-launch',
        title: 'Product Launch',
        description: 'Announce a new product and build excitement for the launch.',
        icon: 'Rocket',
        objective: 'Announce the launch of a new product, explain its key features, and drive traffic to the sales page.',
        tone: 'Excited',
        productDetails: 'We are launching our new product: [Product Name]. It helps users solve [Problem]. The top 3 features are: [Feature 1], [Feature 2], [Feature 3]. The launch-day special offer is [Special Offer].'
    },
     {
        id: 'newsletter-broadcast',
        title: 'Newsletter Broadcast',
        description: 'Send a content-rich newsletter to engage your audience.',
        icon: 'Newspaper',
        objective: 'Share valuable tips, insights, or news with our audience to build trust and engagement.',
        tone: 'Professional',
        productDetails: 'This week\'s newsletter is about [Topic]. The key points to cover are: [Point 1], [Point 2], and [Point 3]. Include a call-to-action to read a related blog post: [Blog Post Link].'
    },
    {
        id: 're-engagement',
        title: 'Re-engagement Campaign',
        description: 'Win back inactive subscribers who haven\'t opened emails recently.',
        icon: 'RefreshCw',
        objective: 'Re-engage a subscriber who has been inactive, remind them of our value, and offer an incentive to stay.',
        tone: 'Witty',
        productDetails: 'The subscriber has not opened an email in 90 days. Remind them that we provide value on [Topic]. Offer them a special [Incentive, e.g., discount code, free resource] as a reason to stick around.'
    },
];

    