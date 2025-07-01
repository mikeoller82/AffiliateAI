
import type { Node, Edge } from 'reactflow';

export interface AutomationTemplate {
    id: string;
    title: string;
    description: string;
    trigger: string;
    steps: number;
    status: 'active' | 'paused';
    nodes: Node[];
    edges: Edge[];
}

const welcomeSequenceNodes: Node[] = [
    { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { icon: 'ClipboardEdit', title: 'Form Submitted', config: { formId: 'form_1' } } },
    { id: '2', type: 'action', position: { x: 250, y: 250 }, data: { icon: 'Mail', title: 'Send Welcome Email', config: { subject: 'Here is your free guide!', body: 'Hi {{contact.name}}, thanks for signing up! Here is the guide you requested.' } } },
    { id: '3', type: 'delay', position: { x: 250, y: 450 }, data: { icon: 'Hourglass', title: 'Wait 2 Days', config: { duration: 2, unit: 'days' } } },
    { id: '4', type: 'action', position: { x: 250, y: 650 }, data: { icon: 'Mail', title: 'Send Follow-up Email', config: { subject: 'Checking in!', body: 'Hi {{contact.name}}, hope you enjoyed the guide. Here is a case study on how others have used it.' } } },
];
const welcomeSequenceEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
];

const webinarReminderNodes: Node[] = [
    { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { icon: 'Tag', title: 'Tag Added: Webinar', config: { tagName: 'Webinar Registrant' } } },
    { id: '2', type: 'action', position: { x: 250, y: 250 }, data: { icon: 'Mail', title: 'Send Confirmation', config: { subject: 'You\'re registered for the webinar!', body: 'Hi {{contact.name}}, thanks for registering! We\'ll see you there.' } } },
    { id: '3', type: 'delay', position: { x: 250, y: 450 }, data: { icon: 'Hourglass', title: 'Wait Until 1 Day Before', config: { duration: 1, unit: 'days' } } },
    { id: '4', type: 'action', position: { x: 250, y: 650 }, data: { icon: 'Mail', title: '24-Hour Reminder', config: { subject: 'Webinar is tomorrow!', body: 'Hey! Just a reminder that the webinar is tomorrow at 2 PM EST.' } } },
    { id: '5', type: 'delay', position: { x: 250, y: 850 }, data: { icon: 'Hourglass', title: 'Wait Until 1 Hour Before', config: { duration: 23, unit: 'hours' } } },
    { id: '6', type: 'action', position: { x: 250, y: 1050 }, data: { icon: 'MessageSquare', title: 'Send SMS Reminder', config: { message: 'Webinar starts in 1 hour! Link: {{webinar.link}}' } } },
];
const webinarReminderEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
    { id: 'e4-5', source: '4', target: '5', animated: true },
    { id: 'e5-6', source: '5', target: '6', animated: true },
];

const postPurchaseNodes: Node[] = [
    { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { icon: 'ShoppingCart', title: 'Product Purchased', config: { productId: 'prod_1' } } },
    { id: '2', type: 'action', position: { x: 250, y: 250 }, data: { icon: 'Tag', title: 'Add "Customer" Tag', config: { tagName: 'Customer' } } },
    { id: '3', type: 'delay', position: { x: 250, y: 450 }, data: { icon: 'Hourglass', title: 'Wait 1 Day', config: { duration: 1, unit: 'days' } } },
    { id: '4', type: 'action', position: { x: 250, y: 650 }, data: { icon: 'Mail', title: 'Send Upsell Offer', config: { subject: 'A special offer for you', body: 'Thanks for your purchase! As a valued customer, here is 20% off our advanced course.' } } },
];
const postPurchaseEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', animated: true },
];

export const automationTemplates: AutomationTemplate[] = [
    {
        id: "welcome-sequence",
        title: "New Lead Welcome Sequence",
        description: "Sends a welcome email and tags new leads after a form submission.",
        status: "active",
        trigger: "Form Submitted",
        steps: 4,
        nodes: welcomeSequenceNodes,
        edges: welcomeSequenceEdges,
    },
    {
        id: "webinar-reminder",
        title: "Webinar Reminder Flow",
        description: "Sends email and SMS reminders to webinar registrants.",
        status: "active",
        trigger: "Tag Added",
        steps: 6,
        nodes: webinarReminderNodes,
        edges: webinarReminderEdges,
    },
    {
        id: "post-purchase-upsell",
        title: "Post-Purchase Upsell",
        description: "Offers a related product one day after a customer makes a purchase.",
        status: "paused",
        trigger: "Product Purchased",
        steps: 4,
        nodes: postPurchaseNodes,
        edges: postPurchaseEdges,
    },
];

export const blankTemplate: AutomationTemplate = {
    id: "blank",
    title: "New Automation",
    description: "Start with a blank canvas.",
    trigger: "",
    steps: 1,
    status: 'paused',
    nodes: [
        { id: '1', type: 'trigger', position: { x: 250, y: 50 }, data: { icon: 'PlayCircle', title: 'Start Trigger', config: {} } },
    ],
    edges: [],
};

export const allTemplates = [...automationTemplates, blankTemplate];

export const getTemplateById = (id: string | undefined): AutomationTemplate => {
    if (!id) return blankTemplate;
    return allTemplates.find(t => t.id === id) || blankTemplate;
}
