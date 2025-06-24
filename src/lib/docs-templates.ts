
import type { JSONContent } from '@tiptap/core';

export interface DocTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string; // keyof typeof Icons
  content: JSONContent;
}

export const docTemplates: DocTemplate[] = [
    {
        id: "getting-started",
        title: "Getting Started Guide",
        description: "Your first steps with HighLaunchPad. Set up your account and launch your first campaign.",
        category: "Onboarding",
        icon: "Rocket",
        content: {
            type: "doc",
            content: [
                { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Welcome to HighLaunchPad!" }] },
                { type: "paragraph", content: [{ type: "text", text: "This guide will walk you through the essential first steps to get your account set up and running. We'll cover setting up your profile, creating your first affiliate link, and building a simple funnel." }] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 1: Complete Your Profile" }] },
                { type: "paragraph", content: [{ type: "text", text: "Your profile information is used for account management and team collaboration. To complete your profile, navigate to " }, { type: "text", marks: [{ type: "bold" }], text: "Settings > Profile" }, { type: "text", text: ". Here you can:" }] },
                { type: "bulletList", content: [
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Upload a profile picture." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Update your full name." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Change your password." }] }] },
                ] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 2: Create Your First Affiliate Link" }] },
                { type: "paragraph", content: [{ type: "text", text: "Affiliate links are the core of your tracking. Go to the " }, { type: "text", marks: [{ type: "bold" }], text: "Affiliate Links" }, { type: "text", text: " section and click 'Create New Link'. Fill in the target URL (where you want to send traffic) and give it a memorable name. Your unique tracking link will be generated instantly." }] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 3: Build a Funnel" }] },
                { type: "paragraph", content: [{ type: "text", text: "Funnels are how you guide visitors to a conversion. Navigate to " }, { type: "text", marks: [{ type: "bold" }], text: "Funnels" }, { type: "text", text: " and select a template. The 'Lead Magnet Funnel' is a great place to start. Use the drag-and-drop editor to customize the text and images to match your offer." }] },
                 { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 4: Explore the AI Tools" }] },
                { type: "paragraph", content: [{ type: "text", text: "Supercharge your workflow with our AI tools. Head to the " }, { type: "text", marks: [{ type: "bold" }], text: "AI Tools" }, { type: "text", text: " section. Try generating some ad copy or a product review to see the power of AI at your fingertips." }] },
            ]
        }
    },
    {
        id: "funnel-builder-deep-dive",
        title: "Funnel Builder Deep Dive",
        description: "Master the drag-and-drop funnel editor. Learn about blocks, styling, and publishing.",
        category: "Funnels",
        icon: "Filter",
        content: {
            type: "doc",
            content: [
                { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Mastering the Funnel Builder" }] },
                { type: "paragraph", content: [{ type: "text", text: "The Funnel Builder is a powerful visual editor that lets you create high-converting landing pages without touching a line of code. This guide covers the main areas of the editor." }] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "The Left Sidebar: Your Toolbox" }] },
                { type: "paragraph", content: [{ type: "text", text: "The sidebar on the left is where you'll find everything you need to build your page." }] },
                { type: "orderedList", content: [
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Components Tab: " }, { type: "text", text: "This is your block library. It contains all the building blocks for your page, such as Headers, Hero sections, Image blocks, and more. Simply click a component to add it to the bottom of your page." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Styling Tab: " }, { type: "text", text: "Control the global look and feel of your page. Here you can change the primary color, background color, text color, and font for the entire funnel." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Settings Tab: " }, { type: "text", text: "Configure your page's domain and URL slug. You can also provide a description of your product or offer here, which gives the AI Assistant context for generating copy." }] }] },
                ] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "The Canvas: Your Masterpiece" }] },
                { type: "paragraph", content: [{ type: "text", text: "The central area is a live preview of your funnel. Hover over any component to reveal a control menu that allows you to:" }] },
                { type: "bulletList", content: [
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Edit:" }, { type: "text", text: " Opens a dialog to change the content of the block." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Move:" }, { type: "text", text: " Drag and drop the block to reorder it on the page." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Delete:" }, { type: "text", text: " Removes the block from the page." }] }] },
                ] },
                 { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Editing and the AI Assistant" }] },
                { type: "paragraph", content: [{ type: "text", text: "When you click the 'Edit' icon, a dialog box appears. The 'Content' tab lets you change text, links, and images manually. The 'AI Assistant' tab is where the magic happens. Select a piece of content to generate (like a 'Headline'), provide a simple instruction, and let the AI write compelling copy for you." }] },
            ]
        }
    },
    {
        id: "ai-tools-overview",
        title: "AI Tools Overview",
        description: "Explore all the built-in AI tools, from ad copy generation to content writing.",
        category: "AI",
        icon: "BrainCircuit",
        content: {
            type: "doc",
            content: [
                { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Leveraging the AI Toolkit" }] },
                { type: "paragraph", content: [{ type: "text", text: "HighLaunchPad's AI tools are designed to eliminate writer's block and speed up your content creation process. Here's a look at each tool available in the AI Tools section." }] },
                { type: "bulletList", content: [
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Ad Generator:" }, { type: "text", text: " Creates compelling headlines, primary text, and descriptions for various ad platforms. Just provide your product, audience, and platform." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Product Review Writer:" }, { type: "text", text: " Generates a complete, SEO-friendly product review in Markdown. Perfect for blog posts or video scripts." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "CTA Optimizer:" }, { type: "text", text: " Suggests high-converting Call-To-Action phrases based on the context you provide." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Hook Generator:" }, { type: "text", text: " Generates short, punchy hooks to grab attention on social media or at the top of a landing page. You can guide it with a target emotion." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Email Content:" }, { type: "text", text: " Your AI email assistant. It creates multiple subject lines and a full email body based on your objective and tone." }] }] },
                    { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Image Generator:" }, { type: "text", text: " Create unique, high-quality images from a text description. Perfect for ads, funnels, and blog posts when you can't find the right stock photo." }] }] },
                ] },
            ]
        }
    },
    {
        id: "crm-contact-management",
        title: "Contact Management",
        description: "Learn how to import, tag, and segment your contacts in the CRM.",
        category: "CRM",
        icon: "Users",
        content: {
            type: "doc",
            content: [
                 { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Managing Your Contacts" }] },
                 { type: "paragraph", content: [{ type: "text", text: "The CRM is the heart of your audience management. It allows you to track leads through your sales process and segment your contacts for targeted marketing." }] },
                 { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "The Lead Pipeline" }] },
                 { type: "paragraph", content: [{ type: "text", text: "The main view of the CRM is the Lead Pipeline, which is a Kanban-style board. It visualizes your sales process with columns like 'New Leads', 'Contacted', 'Proposal Sent', and 'Won'. You can drag and drop leads between stages as they progress." }] },
                 { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Adding & Viewing Contacts" }] },
                 { type: "paragraph", content: [{ type: "text", text: "You can add leads manually using the 'Add Lead' button. To see a detailed view of a contact, including all their activity and information, click on their card in the pipeline. (Note: Detailed contact view is coming soon)." }] },
                 { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Using Tags for Segmentation" }] },
                 { type: "paragraph", content: [{ type: "text", text: "Tags are essential for organizing your contacts. You can add tags like 'Hot Lead', 'Website', or 'Customer' to any contact. These tags can then be used to create Segments in the Email Marketing section for sending targeted campaigns." }] },
            ]
        }
    },
    {
        id: "custom-domain-setup",
        title: "Custom Domain Setup",
        description: "Connect your own domain to funnels and websites for a professional look.",
        category: "Settings",
        icon: "Globe",
        content: {
            type: "doc",
            content: [
                { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Connecting a Custom Domain" }] },
                { type: "paragraph", content: [{ type: "text", text: "Using a custom domain (e.g., www.yourbrand.com) for your funnels and websites makes your brand look professional and builds trust with your audience. This guide explains how to set it up." }] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 1: Add the Domain in Settings" }] },
                { type: "paragraph", content: [{ type: "text", text: "Go to " }, { type: "text", marks: [{ type: "bold" }], text: "Settings > Domains" }, { type: "text", text: " and click 'Add Domain'. Enter the domain you want to connect (e.g., my.awesome-offer.com)." }] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 2: Update Your DNS Records" }] },
                { type: "paragraph", content: [{ type: "text", text: "You will be given a CNAME record value. You need to log in to your domain registrar (like GoDaddy, Namecheap, etc.) and go to the DNS management section. Create a new CNAME record and point it to the value provided by HighLaunchPad." }] },
                { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "Example: If you are setting up 'offers.yourbrand.com', you would create a CNAME record for the host 'offers' and point it to the value we provide, which might look something like 'cname.highlaunchpad.com'." }] }] },
                { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "Step 3: Verification" }] },
                { type: "paragraph", content: [{ type: "text", text: "DNS changes can take anywhere from a few minutes to 48 hours to propagate across the internet. HighLaunchPad will automatically check for the changes. Once verified, the status in your Domains settings will change to 'Connected', and you can start using it for your funnels and websites." }] },
            ]
        }
    },
];

export function getDocById(id: string | undefined): DocTemplate | undefined {
    if (!id) return undefined;
    return docTemplates.find(t => t.id === id);
}
