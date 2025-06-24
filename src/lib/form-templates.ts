
import { nanoid } from 'nanoid';
import type { FormField, FormSettings } from './form-types';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  submissions: number;
  conversionRate: number;
  settings: FormSettings;
  fields: FormField[];
}

export const blankTemplate: FormTemplate = {
    id: 'blank',
    name: 'Blank Form',
    description: 'Start from scratch with a blank canvas.',
    submissions: 0,
    conversionRate: 0,
    settings: {
        name: 'My New Form',
        submitButtonText: 'Submit',
        successMessage: 'Thank you for your submission!',
    },
    fields: [
        { id: nanoid(), type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
        { id: nanoid(), type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
    ]
}

export const formTemplates: FormTemplate[] = [
    {
        id: "lead-magnet-opt-in",
        name: "Lead Magnet Opt-in",
        description: "Captures name and email for the AI Playbook.",
        submissions: 1254,
        conversionRate: 34.2,
        settings: {
            name: "Download Your Free AI Playbook",
            submitButtonText: "Get the Playbook",
            successMessage: "Thanks! Your playbook is on its way to your inbox.",
        },
        fields: [
            { id: nanoid(), type: 'text', label: 'First Name', placeholder: 'Enter your first name', required: true },
            { id: nanoid(), type: 'email', label: 'Email Address', placeholder: 'Enter your email address', required: true },
        ],
    },
    {
        id: "contact-us",
        name: "Contact Us",
        description: "Standard contact form for the main website.",
        submissions: 342,
        conversionRate: 88.1,
        settings: {
            name: "Get In Touch",
            submitButtonText: "Send Message",
            successMessage: "We've received your message and will get back to you shortly.",
        },
        fields: [
            { id: nanoid(), type: 'text', label: 'Full Name', placeholder: 'e.g., Jane Doe', required: true },
            { id: nanoid(), type: 'email', label: 'Work Email', placeholder: 'you@company.com', required: true },
            { id: nanoid(), type: 'textarea', label: 'Message', placeholder: 'How can we help you?', required: true },
        ],
    },
    {
        id: "webinar-registration",
        name: "Webinar Registration",
        description: "Form for the weekly live training session.",
        submissions: 812,
        conversionRate: 22.5,
        settings: {
            name: "Register for the Free Webinar",
            submitButtonText: "Save My Spot!",
            successMessage: "You're registered! Check your email for the confirmation and link.",
        },
        fields: [
            { id: nanoid(), type: 'text', label: 'First Name', placeholder: 'Your first name', required: true },
            { id: nanoid(), type: 'email', label: 'Best Email', placeholder: 'Where should we send the link?', required: true },
            { id: nanoid(), type: 'checkbox', label: 'Yes, send me reminders before the webinar starts.', required: false },
        ],
    },
];

export function getTemplateById(id: string | null): FormTemplate {
    if (!id) {
        return blankTemplate;
    }
    return formTemplates.find(template => template.id === id) || blankTemplate;
}
