# Feature: Drag-and-Drop Funnel Builder

HighLaunchPad's Funnel Builder allows you to create sophisticated sales and lead generation funnels with an intuitive drag-and-drop interface. It's designed for rapid development and high conversion rates.

## Overview

The Funnel Builder is accessible from the main dashboard. You can create funnels from pre-designed templates or start with a blank canvas. The editor (`src/app/dashboard/funnels/[templateId]/page.tsx`) provides a live preview of your funnel as you build it.

Key aspects:

*   **Component-Based:** Funnels are constructed using various pre-built components.
*   **Visual Editing:** What you see is what you get (WYSIWYG) for the most part.
*   **Styling Control:** Customize global styles (colors, fonts) and component-specific styles (e.g., button appearance).
*   **AI Content Assistance:** Generate or refine copy for your funnel components directly within the editor.
*   **Responsive Design:** Funnels are designed to be mobile-responsive (leveraging Tailwind CSS).

## Using the Funnel Builder

### 1. Creating or Opening a Funnel

*   Navigate to **Dashboard > Funnels**.
*   Choose a pre-built template or click "New Blank Funnel".
*   This will open the Funnel Editor page.

### 2. The Editor Interface

The editor is typically laid out with:

*   **Sidebar:**
    *   **Components Tab:** Add new components to your funnel.
    *   **Styling Tab:** Adjust global page styles (primary color, background color, text color, font) and button styles (border radius, shadow).
    *   **Settings Tab:** Configure page settings like custom domain, URL slug, and provide a product/offer description for AI context.
*   **Canvas:** The main area where you see a live preview of your funnel. Components can be reordered (drag-and-drop support is available via `@dnd-kit/core`) and selected for editing.

### 3. Available Components

You can add the following types of components to your funnel pages:

*   **Layout:**
    *   `Header`: Site navigation and branding.
    *   `Footer`: Copyright information and secondary links.
*   **Content Sections:**
    *   `Hero`: Main headline, subheadline, and call-to-action for your landing page.
    *   `Features`: Highlight key benefits or features of your product/service.
    *   `Testimonials`: Showcase social proof with customer quotes.
    *   `Text Block`: For general paragraph text or custom content.
    *   `Button`: Standalone call-to-action buttons.
*   **Media:**
    *   `Image`: Add images to your funnel.
    *   `Video`: Embed videos (e.g., from YouTube).
*   **Advanced:**
    *   `Custom HTML`: Inject your own HTML code for specific needs.

### 4. Adding and Editing Components

*   **Adding:** Click on a component type in the "Components" tab of the sidebar to add it to the canvas.
*   **Editing:**
    *   Hover over a component on the canvas. Controls will appear (usually edit, move, delete icons).
    *   Click the "Edit" (pencil) icon. This opens a dialog where you can modify the component's content (text, links, image URLs, etc.).
    *   For components with text fields (like Hero, Text, Button), you can often use the "AI Assistant" tab within the edit dialog to generate or refine copy. See [AI-Powered Content Engine](Core-Features-AI-Powered-Content-Engine.md) for more details.
*   **Moving:** Use the "Move" (drag) icon to reorder components on the page.
*   **Deleting:** Use the "Delete" (trash) icon to remove a component.

### 5. Styling Your Funnel

*   **Global Styles (Styling Tab):**
    *   **Primary Color:** Sets the main accent color for buttons and other elements.
    *   **Background Color:** Sets the page background.
    *   **Text Color:** Sets the default text color.
    *   **Font Family:** Choose from a selection of web-safe fonts.
*   **Button Styles (Styling Tab):**
    *   **Border Radius:** Control the roundness of button corners.
    *   **Shadow:** Apply different shadow styles to buttons.

### 6. Page Settings (Settings Tab)

*   **Custom Domain:** (Functionality might depend on deployment setup) Optionally link a custom domain to this funnel.
*   **Slug:** Define the URL path for your funnel (e.g., `yourdomain.com/my-awesome-funnel`).
*   **Product/Offer Description (for AI):** Provide context about what your funnel is promoting. This helps the AI generate more relevant copy.

### 7. AI for Funnel Copy

*   When editing a component with text content (e.g., Hero title, Text block), the edit dialog will have an "AI Assistant" tab.
*   Ensure you've provided a "Product/Offer Description" in the funnel's Settings tab.
*   Select the specific field you want to generate content for (e.g., "Headline", "Subtitle").
*   Enter an optional prompt or instruction for the AI.
*   Click "Generate with AI". The AI will produce copy based on your product description and prompt.
*   You can then choose to "Use this copy" to apply it to the selected field.
*   An AI API Key is required for this feature. See [AI-Powered Content Engine](Core-Features-AI-Powered-Content-Engine.md).

### 8. Saving and Publishing

*(Developer Note: The exact save/publish mechanism needs to be detailed based on implementation. Assuming there's a save button or automatic saving.)*

*   Ensure your changes are saved.
*   Once configured, your funnel will be accessible via its slug on your main domain or the custom domain you've set up.

## Advanced Tips

*   **A/B Testing & Conversion Tracking:** The README mentions these features.
    *(Developer Note: Details on how to set up A/B tests and track conversions (e.g., analytics integration, event tracking) need to be added here once the implementation is clear.)*
*   **Payment Integration:** The README mentions "Payment integration ready".
    *(Developer Note: How to connect payment gateways (e.g., Stripe) to funnel CTAs for direct sales needs to be documented here.)*

This Funnel Builder is a cornerstone of HighLaunchPad, enabling you to quickly create and optimize your marketing campaigns.
