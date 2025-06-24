
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Move, Trash2, PanelTop, PanelBottom, ImageIcon, VideoIcon, Code, Pencil, RectangleHorizontal, Type, Wand2, Loader2, Star, MessageSquare, HelpCircle, DollarSign, Contact, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateFunnelCopy, type GenerateFunnelCopyInput } from '@/ai/flows/generate-funnel-copy';
import { useToast } from '@/hooks/use-toast';
import { getWebsiteComponentsById } from '@/lib/website-templates';
import { defaultContent } from '@/lib/default-content';
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


export default function WebsiteEditorPage() {
  const params = useParams<{ websiteId: string }>();
  const { toast } = useToast();
  
  const initialComponents = getWebsiteComponentsById(params.websiteId);

  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [styles, setStyles] = useState({
    primaryColor: '#4F46E5',
    primaryColorForeground: '#FFFFFF',
    backgroundColor: '#111827',
    textColor: '#F9FAFB',
    font: 'Inter'
  });
  const [buttonStyles, setButtonStyles] = useState({
    borderRadius: 8,
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  });
  const [domain, setDomain] = useState('');
  const [slug, setSlug] = useState(params.websiteId);
  const [websiteProductInfo, setWebsiteProductInfo] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [currentContent, setCurrentContent] = useState<any>({});

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTargetField, setAiTargetField] = useState({ value: '', label: '' });
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');


  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      id: Date.now(),
      type: type,
      content: defaultContent[type],
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id: number) => {
    setComponents(components.filter(c => c.id !== id));
  }

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStyles({ ...styles, [e.target.name]: e.target.value });
  }

  const handleFontChange = (value: string) => {
      setStyles({ ...styles, font: value });
  }

  const handleButtonStylesChange = (key: string, value: any) => {
    setButtonStyles(prev => ({ ...prev, [key]: value }));
  }

  const resetAiState = () => {
    setAiPrompt('');
    setAiTargetField({ value: '', label: '' });
    setAiIsLoading(false);
    setAiResult('');
  }

  const openEditDialog = (component: Component) => {
    setEditingComponent(component);
    setCurrentContent(JSON.parse(JSON.stringify(component.content))); // Deep copy
    resetAiState();
    setIsEditDialogOpen(true);
  };

  const handleContentChange = (field: string, value: any, parentField?: string, index?: number) => {
    if (parentField && index !== undefined) {
        setCurrentContent((prev: any) => {
            const newParentArray = [...prev[parentField]];
            newParentArray[index] = { ...newParentArray[index], [field]: value };
            return { ...prev, [parentField]: newParentArray };
        });
    } else {
        setCurrentContent((prev: any) => ({ ...prev, [field]: value }));
    }
  }

  const saveChanges = () => {
    if (editingComponent) {
        const updatedComponent = { ...editingComponent, content: currentContent };
        setComponents(components.map(c =>
            c.id === editingComponent.id ? updatedComponent : c
        ));
    }
    setIsEditDialogOpen(false);
    setEditingComponent(null);
    setCurrentContent({});
  };

  const getEditableFieldsForAI = (type: ComponentType | null) => {
    if (!type) return [];
    switch (type) {
        case 'hero':
            return [ { value: 'title', label: 'Headline' }, { value: 'subtitle', label: 'Subtitle' }, { value: 'cta', label: 'Button Text' } ];
        case 'text':
            return [{ value: 'text', label: 'Text Content' }];
        case 'button':
            return [{ value: 'text', label: 'Button Text' }];
        case 'image':
            return [{ value: 'alt', label: 'Image Alt Text' }];
        case 'video':
        case 'features':
        case 'testimonials':
        case 'header':
        case 'pricing':
        case 'faq':
        case 'contact':
            return [{ value: 'title', label: 'Section Title' }];
        case 'footer':
            return [{ value: 'copyright', label: 'Copyright Text' }];
        default:
            return [];
    }
  };

  const handleAiGenerate = async () => {
    if (!aiTargetField.value || !websiteProductInfo) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a product/service description in the Settings tab and select a content type to generate.',
      });
      return;
    }

    setAiIsLoading(true);
    setAiResult('');
    try {
      const input: GenerateFunnelCopyInput = {
        productDescription: websiteProductInfo,
        copyType: aiTargetField.label,
        userPrompt: aiPrompt || `Generate a standard ${aiTargetField.label}`,
      };
      const result = await generateFunnelCopy(input);
      setAiResult(result.generatedCopy);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: 'An error occurred while generating content. Please try again.',
      });
    } finally {
      setAiIsLoading(false);
    }
  };

  const handleUseAiResult = () => {
    if (aiResult && aiTargetField.value) {
      handleContentChange(aiTargetField.value, aiResult);
      toast({
        title: 'Content Updated',
        description: `The ${aiTargetField.label.toLowerCase()} has been updated with the AI-generated copy.`,
      });
      setAiResult('');
    }
  };

  const editableFieldsForAI = getEditableFieldsForAI(editingComponent?.type);


  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-card border-r overflow-y-auto">
          <Card className="rounded-none border-0 border-b sticky top-0 z-10">
            <CardHeader>
              <CardTitle>Website Editor</CardTitle>
            </CardHeader>
          </Card>
          <Tabs defaultValue="components" className="p-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="components" className="space-y-2 pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Layout</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('header')}><PanelTop className="mr-2 h-4 w-4" /> Header</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('footer')}><PanelBottom className="mr-2 h-4 w-4" /> Footer</Button>

              <h3 className="font-semibold text-sm text-muted-foreground pt-4">Content Sections</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('hero')}><Star className="mr-2 h-4 w-4" /> Hero</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('features')}><PlusCircle className="mr-2 h-4 w-4" /> Features</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('testimonials')}><MessageSquare className="mr-2 h-4 w-4" /> Testimonials</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('pricing')}><DollarSign className="mr-2 h-4 w-4" /> Pricing</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('faq')}><HelpCircle className="mr-2 h-4 w-4" /> FAQ</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('contact')}><Contact className="mr-2 h-4 w-4" /> Contact</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('text')}><Type className="mr-2 h-4 w-4" /> Text Block</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('button')}><RectangleHorizontal className="mr-2 h-4 w-4" /> Button</Button>
              
              <h3 className="font-semibold text-sm text-muted-foreground pt-4">Media</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('image')}><ImageIcon className="mr-2 h-4 w-4" /> Image</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('video')}><VideoIcon className="mr-2 h-4 w-4" /> Video</Button>

              <h3 className="font-semibold text-sm text-muted-foreground pt-4">Advanced</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('customHtml')}><Code className="mr-2 h-4 w-4" /> Custom HTML</Button>

            </TabsContent>
            <TabsContent value="styling" className="space-y-4 pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Global Styles</h3>
              <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                      <Input id="primaryColor" name="primaryColor" type="color" value={styles.primaryColor} onChange={handleStyleChange} className="w-10 h-10 p-1" />
                      <Input value={styles.primaryColor} onChange={handleStyleChange} name="primaryColor" className="flex-1" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex items-center gap-2">
                      <Input id="backgroundColor" name="backgroundColor" type="color" value={styles.backgroundColor} onChange={handleStyleChange} className="w-10 h-10 p-1" />
                      <Input value={styles.backgroundColor} onChange={handleStyleChange} name="backgroundColor" className="flex-1" />
                  </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex items-center gap-2">
                      <Input id="textColor" name="textColor" type="color" value={styles.textColor} onChange={handleStyleChange} className="w-10 h-10 p-1" />
                      <Input value={styles.textColor} onChange={handleStyleChange} name="textColor" className="flex-1" />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font">Font Family</Label>
                <Select onValueChange={handleFontChange} defaultValue={styles.font}>
                  <SelectTrigger id="font">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <h3 className="font-semibold text-sm text-muted-foreground pt-4">Button Styles</h3>
                <div className="space-y-2">
                    <Label htmlFor="buttonBorderRadius">Border Radius ({buttonStyles.borderRadius}px)</Label>
                    <Slider
                        id="buttonBorderRadius"
                        min={0}
                        max={32}
                        step={1}
                        value={[buttonStyles.borderRadius]}
                        onValueChange={(value) => handleButtonStylesChange('borderRadius', value[0])}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="buttonShadow">Shadow</Label>
                    <Select
                        onValueChange={(value) => handleButtonStylesChange('shadow', value)}
                        defaultValue={buttonStyles.shadow}
                    >
                        <SelectTrigger id="buttonShadow">
                            <SelectValue placeholder="Select a shadow" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="0 1px 2px 0 rgb(0 0 0 / 0.05)">Small</SelectItem>
                            <SelectItem value="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">Medium (Default)</SelectItem>
                            <SelectItem value="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)">Large</SelectItem>
                            <SelectItem value="0 25px 50px -12px rgb(0 0 0 / 0.25)">Extra Large</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Page Settings</h3>
              <div className="space-y-2">
                  <Label htmlFor="domain">Custom Domain</Label>
                  <Input
                      id="domain"
                      name="domain"
                      placeholder="e.g., yourdomain.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                      Leave empty to use the default domain.
                  </p>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                      id="slug"
                      name="slug"
                      placeholder="e.g., my-awesome-website"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                  />
              </div>
               <div className="space-y-2 pt-4">
                    <Label htmlFor="website-product-info">Business/Service Description (for AI)</Label>
                    <Textarea
                        id="website-product-info"
                        placeholder="Describe the business or service this website is for. This will be used as context for the AI Assistant."
                        value={websiteProductInfo}
                        onChange={(e) => setWebsiteProductInfo(e.target.value)}
                        className="min-h-[120px]"
                    />
                </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3 bg-muted/30 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-lg shadow-lg"
              style={{ backgroundColor: styles.backgroundColor, fontFamily: styles.font }}
            >
              {components.map(component => {
                  const ComponentPreview = componentMap[component.type];
                  if (!ComponentPreview) return null;
                  const isStructural = component.type === 'header' || component.type === 'footer';
                  
                  return (
                      <div key={component.id} className={cn("relative group border-2 border-transparent hover:border-primary hover:border-dashed", !isStructural && "my-4")}>
                           <div className="absolute -top-3 right-2 z-10 hidden group-hover:flex items-center gap-1 bg-primary p-1 rounded-md shadow text-primary-foreground">
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary-foreground/20" onClick={() => openEditDialog(component)}>
                                    <Pencil className="h-4 w-4"/>
                                </Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 cursor-move hover:bg-primary-foreground/20"><Move className="h-4 w-4"/></Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-primary-foreground/20 hover:text-destructive-foreground" onClick={() => removeComponent(component.id)}><Trash2 className="h-4 w-4"/></Button>
                           </div>
                          <ComponentPreview content={component.content} styles={styles} buttonStyles={buttonStyles} />
                      </div>
                  );
              })}
              {components.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">Add components from the sidebar to build your page.</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          if (!open) { setEditingComponent(null); }
          setIsEditDialogOpen(open);
      }}>
          <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                  <DialogTitle>Edit {editingComponent?.type} Component</DialogTitle>
                  <DialogDescription>
                      Make changes to your component content here. Click save when you're done.
                  </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="ai-assistant" disabled={editableFieldsForAI.length === 0}>AI Assistant</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                    {/* Common fields */}
                    {['hero', 'video', 'features', 'testimonials', 'pricing', 'faq', 'contact'].includes(editingComponent?.type || '') && (
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="comp-title">Section Title</Label>
                            <Input id="comp-title" value={currentContent.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
                        </div>
                    )}

                    {/* Specific fields */}
                    {editingComponent?.type === 'text' && ( <div className="space-y-2"><Label htmlFor="text-content">Text</Label><Textarea id="text-content" value={currentContent.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} className="min-h-[200px]" /></div> )}
                    {editingComponent?.type === 'button' && ( <div className="grid gap-4"><div className="space-y-2"><Label htmlFor="button-text">Button Text</Label><Input id="button-text" value={currentContent.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} /></div><div className="space-y-2"><Label htmlFor="button-href">Link URL</Label><Input id="button-href" value={currentContent.href || ''} onChange={(e) => handleContentChange('href', e.target.value)} placeholder="https://example.com" /></div></div> )}
                    {editingComponent?.type === 'customHtml' && ( <div className="space-y-2"><Label htmlFor="html-content">Custom HTML</Label><Textarea id="html-content" value={currentContent.html || ''} onChange={(e) => handleContentChange('html', e.target.value)} className="min-h-[400px] font-mono text-sm bg-muted/50" placeholder="<div>Your custom HTML code here</div>"/></div>)}
                    {editingComponent?.type === 'hero' && ( <div className="space-y-4"><div className="space-y-2"><Label htmlFor="hero-subtitle">Subtitle</Label><Input id="hero-subtitle" value={currentContent.subtitle || ''} onChange={(e) => handleContentChange('subtitle', e.target.value)} /></div><div className="space-y-2"><Label htmlFor="hero-cta">CTA Text</Label><Input id="hero-cta" value={currentContent.cta || ''} onChange={(e) => handleContentChange('cta', e.target.value)} /></div></div>)}
                    {editingComponent?.type === 'image' && ( <div className="space-y-4"><div className="space-y-2"><Label htmlFor="image-src">Image URL</Label><Input id="image-src" value={currentContent.src || ''} onChange={(e) => handleContentChange('src', e.target.value)} /></div><div className="space-y-2"><Label htmlFor="image-alt">Alt Text</Label><Input id="image-alt" value={currentContent.alt || ''} onChange={(e) => handleContentChange('alt', e.target.value)} /></div><div className="space-y-2"><Label htmlFor="image-hint">AI Hint</Label><Input id="image-hint" value={currentContent.hint || ''} onChange={(e) => handleContentChange('hint', e.target.value)} /><p className="text-xs text-muted-foreground">One or two keywords for AI image search.</p></div></div>)}
                    {editingComponent?.type === 'video' && ( <div className="space-y-2"><Label htmlFor="video-embed">YouTube Embed URL</Label><Input id="video-embed" value={currentContent.embedUrl || ''} onChange={(e) => handleContentChange('embedUrl', e.target.value)} /></div>)}
                    
                    {/* Complex list editors */}
                    {['header', 'footer'].includes(editingComponent?.type || '') && (
                        <div className="space-y-4">
                            {editingComponent?.type === 'header' && <div className="space-y-2"><Label htmlFor="header-title">Brand/Logo Text</Label><Input id="header-title" value={currentContent.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} /></div>}
                            {editingComponent?.type === 'footer' && <div className="space-y-2"><Label htmlFor="footer-copyright">Copyright Text</Label><Input id="footer-copyright" value={currentContent.copyright || ''} onChange={(e) => handleContentChange('copyright', e.target.value)} /></div>}
                            <Label>Navigation Links</Label>
                            {currentContent.links?.map((link: any, index: number) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center"><Input className="col-span-5" placeholder="Link Label" value={link.label} onChange={(e) => handleContentChange('label', e.target.value, 'links', index)} /><Input className="col-span-6" placeholder="URL" value={link.href} onChange={(e) => handleContentChange('href', e.target.value, 'links', index)} /><Button variant="ghost" size="icon" className="col-span-1" onClick={() => handleContentChange('links', currentContent.links.filter((_: any, i: number) => i !== index))}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
                            ))}
                            <Button variant="outline" onClick={() => handleContentChange('links', [...(currentContent.links || []), { label: 'New Link', href: '#' }])}><PlusCircle className="mr-2 h-4 w-4" /> Add Link</Button>
                        </div>
                    )}
                    
                    {/* FAQ Editor */}
                    {editingComponent?.type === 'faq' && (
                        <div className="space-y-4">
                            <Label>Questions & Answers</Label>
                            {currentContent.faqs?.map((faq: any, index: number) => (
                                <div key={index} className="p-3 rounded-md border space-y-2">
                                    <Label htmlFor={`faq-q-${index}`}>Question</Label><Input id={`faq-q-${index}`} value={faq.question} onChange={(e) => handleContentChange('question', e.target.value, 'faqs', index)} />
                                    <Label htmlFor={`faq-a-${index}`}>Answer</Label><Textarea id={`faq-a-${index}`} value={faq.answer} onChange={(e) => handleContentChange('answer', e.target.value, 'faqs', index)} />
                                    <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive" onClick={() => handleContentChange('faqs', currentContent.faqs.filter((_:any, i:number) => i !== index))}><Trash2 className="mr-2 h-4 w-4"/> Remove</Button>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" onClick={() => handleContentChange('faqs', [...(currentContent.faqs || []), {question: 'New Question?', answer: 'Answer goes here.'}])}><PlusCircle className="mr-2 h-4 w-4" /> Add FAQ</Button>
                        </div>
                    )}
                    
                    {/* Pricing Tier Editor */}
                    {editingComponent?.type === 'pricing' && (
                        <div className="space-y-4">
                             <Label>Pricing Tiers</Label>
                             {currentContent.tiers?.map((tier: any, index: number) => (
                                 <div key={index} className="p-3 rounded-md border space-y-2">
                                     <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1"><Label>Title</Label><Input value={tier.title} onChange={(e) => handleContentChange('title', e.target.value, 'tiers', index)} /></div>
                                        <div className="space-y-1"><Label>Price</Label><Input value={tier.price} onChange={(e) => handleContentChange('price', e.target.value, 'tiers', index)} /></div>
                                        <div className="space-y-1"><Label>Frequency</Label><Input value={tier.frequency} onChange={(e) => handleContentChange('frequency', e.target.value, 'tiers', index)} placeholder="/mo"/></div>
                                        <div className="space-y-1"><Label>CTA Text</Label><Input value={tier.cta} onChange={(e) => handleContentChange('cta', e.target.value, 'tiers', index)} /></div>
                                     </div>
                                     <div className="space-y-1"><Label>Description</Label><Input value={tier.description} onChange={(e) => handleContentChange('description', e.target.value, 'tiers', index)} /></div>
                                     <div className="space-y-1"><Label>Features (one per line)</Label><Textarea value={tier.features.join('\n')} onChange={(e) => handleContentChange('features', e.target.value.split('\n'), 'tiers', index)} /></div>
                                     <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive" onClick={() => handleContentChange('tiers', currentContent.tiers.filter((_:any, i:number) => i !== index))}><Trash2 className="mr-2 h-4 w-4"/> Remove Tier</Button>
                                 </div>
                             ))}
                             <Button variant="outline" className="w-full" onClick={() => handleContentChange('tiers', [...(currentContent.tiers || []), defaultContent.pricing.tiers[0] ])}><PlusCircle className="mr-2 h-4 w-4" /> Add Tier</Button>
                        </div>
                    )}


                </TabsContent>

                <TabsContent value="ai-assistant" className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Content to Generate</Label>
                            <Select value={aiTargetField.value} onValueChange={(v) => {
                                const field = editableFieldsForAI.find(f => f.value === v);
                                if (field) setAiTargetField(field);
                            }}>
                                <SelectTrigger><SelectValue placeholder="Select what to generate..." /></SelectTrigger>
                                <SelectContent>{editableFieldsForAI.map(field => ( <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ai-prompt">Prompt / Instruction</Label>
                            <Textarea id="ai-prompt" placeholder="e.g., Make it sound more urgent and exclusive." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
                        </div>
                        <Button onClick={handleAiGenerate} disabled={aiIsLoading || !aiTargetField.value}>
                            {aiIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                            Generate with AI
                        </Button>
                        {(aiIsLoading || aiResult) && (
                             <div className="space-y-2 pt-4">
                                <Label>Generated Result</Label>
                                <div className="p-4 rounded-md border bg-muted min-h-[120px]">
                                    {aiIsLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Generating...</span></div>}
                                    {aiResult && <p className="whitespace-pre-wrap">{aiResult}</p>}
                                </div>
                                {aiResult && <Button onClick={handleUseAiResult}>Use this copy</Button>}
                            </div>
                        )}
                    </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={saveChanges}>Save Changes</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
