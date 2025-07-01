
import { useAuth } from '@/contexts/auth-context';
import type { FormField, FormSettings } from './form-types';

// In a real app, ownerId would be set to the current user's ID upon creation.
// Using a placeholder here for the template.
const PLACEHOLDER_OWNER_ID = 'user_placeholder_id';

export const blankTemplate: { settings: FormSettings, fields: FormField[] } = {
    settings: {
        id: 'blank',
        name: 'Blank Form',
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!',
        ownerId: PLACEHOLDER_OWNER_ID,
    },
    fields: [
        { id: 'field_name', type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
        { id: 'field_email', type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
    ]
}

export const formTemplates: { id: string, name: string, description: string, submissions: number, conversionRate: number, settings: FormSettings, fields: FormField[] }[] = [
    {
        id: "lead-magnet-opt-in",
        name: "Lead Magnet Opt-in",
        description: "Captures name and email for the AI Playbook.",
        submissions: 1254,
        conversionRate: 34.2,
        settings: {
            id: "lead-magnet-opt-in",
            name: "Download Your Free AI Playbook",
            submitButtonText: "Get the Playbook",
            successMessage: "Thanks! Your playbook is on its way to your inbox.",
            ownerId: PLACEHOLDER_OWNER_ID,
        },
        fields: [
            { id: 'lm_field_name', type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
            { id: 'lm_field_email', type: 'email', label: 'Email Address', placeholder: 'Enter your email address', required: true },
        ],
    },
    {
        id: "contact-us",
        name: "Contact Us",
        description: "Standard contact form for the main website.",
        submissions: 342,
        conversionRate: 88.1,
        settings: {
            id: "contact-us",
            name: "Get In Touch",
            submitButtonText: "Send Message",
            successMessage: "We've received your message and will get back to you shortly.",
            ownerId: PLACEHOLDER_OWNER_ID,
        },
        fields: [
            { id: 'cu_field_name', type: 'text', label: 'Full Name', placeholder: 'e.g., Jane Doe', required: true },
            { id: 'cu_field_email', type: 'email', label: 'Work Email', placeholder: 'you@company.com', required: true },
            { id: 'cu_field_message', type: 'textarea', label: 'Message', placeholder: 'How can we help you?', required: true },
        ],
    },
    {
        id: "webinar-registration",
        name: "Webinar Registration",
        description: "Form for the weekly live training session.",
        submissions: 812,
        conversionRate: 22.5,
        settings: {
            id: "webinar-registration",
            name: "Register for the Free Webinar",
            submitButtonText: "Save My Spot!",
            successMessage: "You're registered! Check your email for the confirmation and link.",
            ownerId: PLACEHOLDER_OWNER_ID,
        },
        fields: [
            { id: 'wr_field_name', type: 'text', label: 'First Name', placeholder: 'Your first name', required: true },
            { id: 'wr_field_email', type: 'email', label: 'Best Email', placeholder: 'Where should we send the link?', required: true },
            { id: 'wr_field_reminders', type: 'checkbox', label: 'Yes, send me reminders before the webinar starts.', required: false },
        ],
    },
];

const allTemplates = [
    {...blankTemplate, id: 'blank', name: 'Blank Form', description: 'Start with a blank canvas.', submissions: 0, conversionRate: 0}, 
    ...formTemplates
];

export function getTemplateById(id: string | null): { id: string; name: string; description: string; submissions: number; conversionRate: number; settings: FormSettings; fields: FormField[]; } {
    if (!id) {
        return allTemplates[0];
    }
    return allTemplates.find(template => template.id === id) || allTemplates[0];
}
