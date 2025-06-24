# Frequently Asked Questions (FAQ)

Here are answers to some common questions about HighLaunchPad.

## General

**Q: What is HighLaunchPad?**
A: HighLaunchPad is an open-source AI-powered CRM and marketing automation platform designed for the creator economy. It helps digital entrepreneurs launch, automate, and scale monetized campaigns. Think of it as an open-source alternative to platforms like GoHighLevel or HubSpot, with a strong focus on AI and creator/affiliate workflows.

**Q: Who is HighLaunchPad for?**
A: It's built for digital entrepreneurs, including:
    *   Affiliate marketers
    *   Course creators
    *   Coaches and consultants
    *   Solopreneurs
    *   Small to medium-sized online businesses
    *   Developers looking for an open-source marketing automation platform to customize.

**Q: Is HighLaunchPad free?**
A: HighLaunchPad operates on a freemium model:
    *   **Free Tier:** A free version with core features will be available, likely with HighLaunchPad branding and some usage limits.
    *   **Pro Plans:** Paid plans (e.g., $29-99/month) will offer features like white-labeling, unlimited sends, advanced team collaboration, and higher usage limits.
    *   As an open-source project, you can also choose to self-host the platform.

**Q: What are the key differentiators of HighLaunchPad?**
A:
    *   **Open Source:** Full transparency, MIT Licensed, extensible, and community-driven. Avoids vendor lock-in.
    *   **AI-Native:** Deeply integrated AI (Google's Genkit with Gemini models) for content generation, automation, and insights.
    *   **Developer Friendly:** Full API access (planned) and a modular architecture for customization.
    *   **Affiliate & Creator Focused:** Tools and workflows are specifically designed for digital marketing and creator economy use cases.
    *   **Cost-Effective:** Aims to provide enterprise-grade capabilities at a much lower price point than traditional CRMs.

## Technical & Self-Hosting

**Q: What are the self-hosting requirements?**
A: To self-host HighLaunchPad, you'll generally need:
    *   A server environment capable of running Node.js.
    *   A PostgreSQL database (as per README guidance).
    *   Ability to set up environment variables for configuration (API keys, database URLs, etc.).
    *   Familiarity with deploying Next.js applications.
    *   Optionally, a reverse proxy like Nginx or Caddy for SSL and custom domains.
    *   Refer to the [Getting Started](Getting-Started.md) guide for more details.

**Q: What technologies is HighLaunchPad built on?**
A: Key technologies include:
    *   Next.js (React framework)
    *   Tailwind CSS
    *   PostgreSQL (planned database) / Prisma ORM
    *   Genkit (Google AI framework with Gemini models)
    *   Node.js
    *   See the [Technical Architecture](Technical-Architecture.md) page for a more detailed list.

**Q: Can I contribute to the project?**
A: Yes! HighLaunchPad is an open-source project, and contributions are highly welcome. Please see our [Contributing Guide](Contributing.md) for details on how to get involved.

## AI Features

**Q: Where do I get an AI API key for the AI features?**
A: HighLaunchPad uses Google's AI models (Gemini) via Genkit. You will need to obtain an API key from:
    *   [Google AI Studio](https://aistudio.google.com/app/apikey)
    This key should be added to your `.env.local` file as `GOOGLE_API_KEY`.

**Q: What can the AI do in HighLaunchPad?**
A: The AI Content Engine can help with:
    *   Generating funnel copy (headlines, subtitles, CTAs)
    *   Drafting email sequences
    *   Creating ad copy
    *   Suggesting CTAs
    *   Editing and rephrasing text
    *   Potentially generating images (if Leonardo.ai integration is fully active)
    *   And more as new AI flows are developed.

## Support & Community

**Q: Where can I get help or support?**
A:
    *   **This Wiki:** For documentation and guides.
    *   **GitHub Issues:** For reporting bugs or requesting features: [https://github.com/mikeoller82/HighLaunchPad/issues](https://github.com/mikeoller82/HighLaunchPad/issues)
    *   **Discord Community:** Join our Discord server for discussions, community support, and announcements. (Link available in the main project `README.md` - *Developer note: Ensure this link is correct and active in the README*).

**Q: How can I stay updated on the project's progress?**
A:
    *   Star and watch the [GitHub repository](https://github.com/mikeoller82/HighLaunchPad).
    *   Join the [Discord Community](https://discord.gg/yourlink) (replace with actual link).
    *   Sign up for the [Product Updates Newsletter](https://highlaunchpad.com/newsletter).

---

If your question isn't answered here, feel free to reach out via the community channels!
