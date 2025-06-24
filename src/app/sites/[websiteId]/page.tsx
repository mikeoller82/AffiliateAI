
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getWebsiteComponentsById } from '@/lib/website-templates';
import type { Component, ComponentType } from '@/lib/builder-types';

// region Preview Components
const HeaderPreview = ({ content, styles }: { content: any, styles: any }) => (
    <header className="p-4" style={{ color: styles.textColor }}>
        <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-xl font-bold">{content.title}</h1>
            <nav className="flex items-center gap-6">
                {content.links.map((link: any, i: number) => (
                    <a key={i} href={link.href} className="text-sm hover:underline transition-colors">{link.label}</a>
                ))}
            </nav>
        </div>
    </header>
);

const HeroPreview = ({ content, styles, buttonStyles }: { content: any, styles: any, buttonStyles: any }) => (
  <div className="p-8 text-center rounded-lg" style={{ color: styles.textColor }}>
    <h2 className="text-4xl font-bold">{content.title}</h2>
    <p className="mt-2 text-lg">{content.subtitle}</p>
    <Button
        className="mt-4"
        style={{
            backgroundColor: styles.primaryColor,
            color: styles.primaryColorForeground,
            borderRadius: `${buttonStyles.borderRadius}px`,
            boxShadow: buttonStyles.shadow,
        }}
    >{content.cta}</Button>
  </div>
);

const ImagePreview = ({ content }: { content: any }) => (
    <div className="py-8">
        <div className="relative aspect-video max-w-5xl mx-auto">
             <Image src={content.src} alt={content.alt} fill className="object-cover rounded-lg shadow-lg" data-ai-hint={content.hint} />
        </div>
    </div>
);

const VideoPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8 text-center" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold mb-6">{content.title}</h2>
        <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden bg-black shadow-2xl">
            <iframe
                src={content.embedUrl}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
    </div>
);

const FeaturesPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8 rounded-lg text-center" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold">{content.title}</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
            {content.features.map((feat: any, i: number) => (
                <div key={i} className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <h3 className="font-semibold text-xl">{feat.title}</h3>
                    <p className="text-sm mt-2 opacity-80">{feat.description}</p>
                </div>
            ))}
        </div>
  </div>
);

const TestimonialsPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8 rounded-lg text-center" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold">{content.title}</h2>
         <div className="grid md:grid-cols-2 gap-6 mt-6">
            {content.testimonials.map((testimonial: any, i: number) => (
                <div key={i} className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <blockquote className="italic">"{testimonial.quote}"</blockquote>
                    <p className="font-semibold mt-2">- {testimonial.author}</p>
                </div>
            ))}
        </div>
    </div>
);

const FooterPreview = ({ content, styles }: { content: any, styles: any }) => (
  <footer className="p-8 mt-10 border-t" style={{ color: styles.textColor, borderColor: styles.textColor + '33' }}>
    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 max-w-6xl mx-auto">
      <p className="text-sm opacity-80">{content.copyright}</p>
      <div className="flex gap-4">
        {content.links.map((link: any, i: number) => (
            <a key={i} href={link.href} className="text-sm hover:underline opacity-80 hover:opacity-100 transition-opacity">{link.label}</a>
        ))}
      </div>
    </div>
  </footer>
);

const CustomHtmlPreview = ({ content }: { content: any }) => (
    <div className="p-2" dangerouslySetInnerHTML={{ __html: content.html }} />
);

const TextPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-4" style={{ color: styles.textColor }}>
        <p className="whitespace-pre-wrap">{content.text}</p>
    </div>
);

const ButtonPreview = ({ content, styles, buttonStyles }: { content: any, styles: any, buttonStyles: any }) => (
    <div className="p-4 text-center">
        <Button
            asChild
            variant={content.variant}
            style={{
                backgroundColor: styles.primaryColor,
                color: styles.primaryColorForeground,
                borderRadius: `${buttonStyles.borderRadius}px`,
                boxShadow: buttonStyles.shadow,
            }}
        >
            <a href={content.href}>{content.text}</a>
        </Button>
    </div>
);

const PricingPreview = ({ content, styles, buttonStyles }: { content: any, styles: any, buttonStyles: any }) => (
    <div className="p-8 rounded-lg text-center" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold">{content.title}</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
            {content.tiers?.map((tier: any, i: number) => (
                 <Card key={i} className={cn("flex flex-col", tier.featured ? "border-primary shadow-glow-primary" : "")}>
                    <CardHeader>
                        <CardTitle className="text-2xl">{tier.title}</CardTitle>
                        <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <div className="text-4xl font-bold">
                            {tier.price} <span className="text-base font-normal text-muted-foreground">{tier.frequency}</span>
                        </div>
                        <ul className="space-y-2 text-left text-sm">
                           {tier.features?.map((feature: string, idx: number) => (
                               <li key={idx} className="flex items-center gap-2">
                                   <Check className="h-4 w-4 text-green-500" />
                                   <span>{feature}</span>
                               </li>
                           ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button
                            className="w-full"
                             style={{
                                backgroundColor: styles.primaryColor,
                                color: styles.primaryColorForeground,
                                borderRadius: `${buttonStyles.borderRadius}px`,
                                boxShadow: buttonStyles.shadow,
                            }}
                        >{tier.cta}</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
);

const FaqPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold text-center">{content.title}</h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto mt-8">
            {content.faqs?.map((faq: any, i: number) => (
                <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
);

const ContactPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8 text-center" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold">{content.title}</h2>
        <p className="mt-2 text-lg max-w-2xl mx-auto">{content.description}</p>
        <div className="mt-6">
            <Card className="max-w-xl mx-auto text-left">
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>First Name</Label><Input disabled placeholder="John"/>
                        </div>
                         <div className="space-y-1">
                            <Label>Last Name</Label><Input disabled placeholder="Doe"/>
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label>Email Address</Label><Input disabled type="email" placeholder="john.doe@example.com"/>
                    </div>
                     <div className="space-y-1">
                        <Label>Message</Label><Textarea disabled placeholder="Your message..."/>
                    </div>
                    <Button className="w-full">Submit</Button>
                </CardContent>
            </Card>
        </div>
    </div>
);


const componentMap: { [key in ComponentType]?: React.FC<any> } = {
  header: HeaderPreview,
  hero: HeroPreview,
  features: FeaturesPreview,
  testimonials: TestimonialsPreview,
  image: ImagePreview,
  video: VideoPreview,
  text: TextPreview,
  button: ButtonPreview,
  customHtml: CustomHtmlPreview,
  footer: FooterPreview,
  pricing: PricingPreview,
  faq: FaqPreview,
  contact: ContactPreview,
};
// endregion

export default function WebsitePreviewPage() {
    const params = useParams<{ websiteId: string }>();
    const components = getWebsiteComponentsById(params.websiteId);

    // Hardcode default styles from editor page for consistency
    const [styles] = useState({
        primaryColor: '#4F46E5',
        primaryColorForeground: '#FFFFFF',
        backgroundColor: '#111827',
        textColor: '#F9FAFB',
        font: 'Inter'
    });
    const [buttonStyles] = useState({
        borderRadius: 8,
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    });

    if (!components) {
        return <div className="flex h-screen items-center justify-center">Template not found.</div>
    }

    return (
        <div style={{ backgroundColor: styles.backgroundColor, fontFamily: styles.font, minHeight: '100vh' }}>
            {components.map(component => {
                const ComponentPreview = componentMap[component.type];
                if (!ComponentPreview) return null;
                return (
                    <div key={component.id}>
                        <ComponentPreview content={component.content} styles={styles} buttonStyles={buttonStyles} />
                    </div>
                );
            })}
        </div>
    );
}
