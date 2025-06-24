
import type { LucideIcon } from 'lucide-react';

export interface DocTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // keyof typeof Icons
}

export const docTemplates: DocTemplate[] = [
    {
        id: "getting-started",
        title: "Getting Started Guide",
        description: "Your first steps with HighLaunchPad. Set up your account and launch your first campaign.",
        category: "Onboarding",
        icon: "Rocket",
    },
    {
        id: "funnel-builder-deep-dive",
        title: "Funnel Builder Deep Dive",
        description: "Master the drag-and-drop funnel editor. Learn about blocks, styling, and publishing.",
        category: "Funnels",
        icon: "Filter",
    },
    {
        id: "ai-tools-overview",
        title: "AI Tools Overview",
        description: "Explore all the built-in AI tools, from ad copy generation to content writing.",
        category: "AI",
        icon: "BrainCircuit",
    },
    {
        id: "crm-contact-management",
        title: "Contact Management",
        description: "Learn how to import, tag, and segment your contacts in the CRM.",
        category: "CRM",
        icon: "Users",
    },
    {
        id: "custom-domain-setup",
        title: "Custom Domain Setup",
        description: "Connect your own domain to funnels and websites for a professional look.",
        category: "Settings",
        icon: "Globe",
    },
];

export function getDocById(id: string | undefined): DocTemplate | undefined {
    if (!id) return undefined;
    return docTemplates.find(t => t.id === id);
}
