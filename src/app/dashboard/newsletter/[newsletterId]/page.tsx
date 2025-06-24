
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Move, Trash2, PanelTop, PanelBottom, ImageIcon, VideoIcon, Code, Pencil, RectangleHorizontal, Type, Wand2, Loader2, Star, MessageSquare, Clock, Send, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { generateFunnelCopy, type GenerateFunnelCopyInput } from '@/ai/flows/generate-funnel-copy';
import { useToast } from '@/hooks/use-toast';
import { getNewsletterTemplateById } from '@/lib/newsletter-templates';
import { defaultContent } from '@/lib/default-content';
import type { Component, ComponentType } from '@/lib/builder-types';

// region Preview Components
const HeaderPreview = ({ content, styles }: { content: any, styles: any }) => (
    <header className="p-4" style={{ color: styles.textColor }}>
        <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-xl font-bold">{content.title}</h1>
        </div>
    </header>
);

const TextPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-4 prose prose-invert max-w-none" style={{ color: styles.textColor }}>
        <p className="whitespace-pre-wrap">{content.text}</p>
    </div>
);

const ImagePreview = ({ content }: { content: any }) => (
    <div className="py-8">
        <div className="relative aspect-video max-w-5xl mx-auto">
             <Image src={content.src} alt={content.alt} fill className="object-cover rounded-lg shadow-lg" data-ai-hint={content.hint} />
        </div>
    </div>
);

const ButtonPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-4 text-center">
        <Button asChild variant={content.variant}>
            <a href={content.href}>{content.text}</a>
        </Button>
    </div>
);

const SocialsPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-6 text-center" style={{ color: styles.textColor }}>
        <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">{content.title}</h4>
        <div className="flex justify-center gap-4">
            {content.links?.map((link: any, i: number) => {
                const Icon = { Twitter, Facebook, Instagram }[link.platform as 'Twitter' | 'Facebook' | 'Instagram'] || Twitter;
                return (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-6 w-6 hover:text-primary transition-colors" />
                    </a>
                )
            })}
        </div>
    </div>
);

const CountdownPreview = ({ content, styles }: { content: any, styles: any }) => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(content.targetDate) - +new Date();
            let newTimeLeft = { d: 0, h: 0, m: 0, s: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    d: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    m: Math.floor((difference / 1000 / 60) % 60),
                    s: Math.floor((difference / 1000) % 60)
                };
            }
            return newTimeLeft;
        }

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Set initial value
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [content.targetDate]);

    return (
        <div className="p-8 text-center" style={{ color: styles.textColor }}>
            <h3 className="text-xl font-semibold mb-4">{content.title}</h3>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-4xl font-bold">{String(timeLeft.d).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-4xl font-bold">{String(timeLeft.h).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-4xl font-bold">{String(timeLeft.m).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                 <div className="p-4 bg-white/10 rounded-lg">
                    <div className="text-4xl font-bold">{String(timeLeft.s).padStart(2, '0')}</div>
                    <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
            </div>
        </div>
    )
}

const OptinFormPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8 my-4 rounded-lg text-center border" style={{ backgroundColor: 'hsl(var(--card))' }}>
        <h3 className="text-2xl font-bold">{content.title}</h3>
        <p className="text-muted-foreground mt-2 mb-6">{content.description}</p>
        <div className="flex gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email address..." className="flex-1" />
            <Button>{content.cta}</Button>
        </div>
    </div>
);


const componentMap: { [key in ComponentType]?: React.FC<any> } = {
  header: HeaderPreview,
  text: TextPreview,
  image: ImagePreview,
  button: ButtonPreview,
  countdown: CountdownPreview,
  socials: SocialsPreview,
  optinForm: OptinFormPreview,
  // Re-using from other builders
  hero: (props) => <div className="p-4"><h2 className="text-3xl font-bold text-center">{props.content.title}</h2><p className="text-lg text-center text-muted-foreground mt-2">{props.content.subtitle}</p></div>,
  video: ({ content }) => <div className="p-4"><div className="aspect-video bg-black rounded-lg mx-auto max-w-3xl"><h3 className="text-white text-center pt-10">Video Preview</h3></div></div>,
  footer: ({ content }) => <footer className="p-4 text-center text-xs text-muted-foreground border-t mt-4">{content.copyright}</footer>,
  features: ({ content }) => <div className="p-4"><h3 className="text-xl text-center font-bold">{content.title}</h3></div>,
};
// endregion


export default function NewsletterEditorPage() {
  const params = useParams<{ newsletterId: string }>();
  const { toast } = useToast();
  
  const template = getNewsletterTemplateById(params.newsletterId);
  const initialComponents = template.components;

  const [components, setComponents] = useState<Component[]>(initialComponents);
  const [styles, setStyles] = useState({
    primaryColor: '#4F46E5',
    primaryColorForeground: '#FFFFFF',
    backgroundColor: '#111827',
    textColor: '#F9FAFB',
    font: 'Inter'
  });
  
  const [newsletterInfo, setNewsletterInfo] = useState({
    name: "My Awesome Newsletter",
    slug: params.newsletterId,
    subject: "This week's news!",
  });
  const [newsletterContext, setNewsletterContext] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [currentContent, setCurrentContent] = useState<any>({});


  const addComponent = (type: ComponentType) => {
    const newComponent: Component = {
      id: Date.now(),
      type: type,
      content: defaultContent[type as keyof typeof defaultContent],
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id: number) => {
    setComponents(components.filter(c => c.id !== id));
  }

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStyles({ ...styles, [e.target.name]: e.target.value });
  }

  const openEditDialog = (component: Component) => {
    setEditingComponent(component);
    setCurrentContent(JSON.parse(JSON.stringify(component.content))); // Deep copy
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

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-card border-r overflow-y-auto">
          <Card className="rounded-none border-0 border-b sticky top-0 z-10">
            <CardHeader>
              <CardTitle>Newsletter Editor</CardTitle>
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

              <h3 className="font-semibold text-sm text-muted-foreground pt-4">Content Blocks</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('text')}><Type className="mr-2 h-4 w-4" /> Text Block</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('image')}><ImageIcon className="mr-2 h-4 w-4" /> Image</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('button')}><RectangleHorizontal className="mr-2 h-4 w-4" /> Button</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('video')}><VideoIcon className="mr-2 h-4 w-4" /> Video</Button>

              <h3 className="font-semibold text-sm text-muted-foreground pt-4">Newsletter Specific</h3>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('countdown')}><Clock className="mr-2 h-4 w-4" /> Countdown</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('socials')}><Send className="mr-2 h-4 w-4" /> Social Links</Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('optinForm')}><Mail className="mr-2 h-4 w-4" /> Opt-in Form</Button>

            </TabsContent>
            <TabsContent value="styling" className="space-y-4 pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Global Styles</h3>
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
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground">Newsletter Settings</h3>
              <div className="space-y-2">
                  <Label htmlFor="name">Newsletter Name</Label>
                  <Input id="name" value={newsletterInfo.name} onChange={(e) => setNewsletterInfo({...newsletterInfo, name: e.target.value})} />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={newsletterInfo.slug} onChange={(e) => setNewsletterInfo({...newsletterInfo, slug: e.target.value})}/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject Line</Label>
                  <Input id="subject" value={newsletterInfo.subject} onChange={(e) => setNewsletterInfo({...newsletterInfo, subject: e.target.value})}/>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3 bg-muted/30 p-6 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <div
              className="rounded-lg shadow-lg"
              style={{ backgroundColor: styles.backgroundColor, fontFamily: styles.font }}
            >
              {components.map(component => {
                  const ComponentPreview = componentMap[component.type];
                  if (!ComponentPreview) return null;
                  return (
                      <div key={component.id} className={cn("relative group border-2 border-transparent hover:border-primary hover:border-dashed")}>
                           <div className="absolute -top-3 right-2 z-10 hidden group-hover:flex items-center gap-1 bg-primary p-1 rounded-md shadow text-primary-foreground">
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-primary-foreground/20" onClick={() => openEditDialog(component)}>
                                    <Pencil className="h-4 w-4"/>
                                </Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 cursor-move hover:bg-primary-foreground/20"><Move className="h-4 w-4"/></Button>
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-primary-foreground/20 hover:text-destructive-foreground" onClick={() => removeComponent(component.id)}><Trash2 className="h-4 w-4"/></Button>
                           </div>
                          <ComponentPreview content={component.content} styles={styles} />
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
          <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                  <DialogTitle>Edit {editingComponent?.type} Component</DialogTitle>
              </DialogHeader>
              <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                 {editingComponent?.type === 'text' && ( <div className="space-y-2"><Label htmlFor="text-content">Text</Label><Textarea id="text-content" value={currentContent.text || ''} onChange={(e) => handleContentChange('text', e.target.value)} className="min-h-[200px]" /></div> )}
                 {editingComponent?.type === 'countdown' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="countdown-title">Title</Label>
                            <Input id="countdown-title" value={currentContent.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="countdown-date">Target Date</Label>
                            <Input id="countdown-date" type="datetime-local" value={currentContent.targetDate?.substring(0,16) || ''} onChange={(e) => handleContentChange('targetDate', new Date(e.target.value).toISOString())} />
                        </div>
                    </div>
                 )}
                 {editingComponent?.type === 'socials' && (
                     <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="socials-title">Title</Label>
                            <Input id="socials-title" value={currentContent.title || ''} onChange={(e) => handleContentChange('title', e.target.value)} />
                        </div>
                         <Label>Social Links</Label>
                         {currentContent.links?.map((link: any, index: number) => (
                             <div key={index} className="flex items-center gap-2">
                                <Select value={link.platform} onValueChange={(v) => handleContentChange('platform', v, 'links', index)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Twitter">Twitter</SelectItem>
                                        <SelectItem value="Facebook">Facebook</SelectItem>
                                        <SelectItem value="Instagram">Instagram</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="URL" value={link.url} onChange={(e) => handleContentChange('url', e.target.value, 'links', index)} />
                                <Button variant="ghost" size="icon" onClick={() => handleContentChange('links', currentContent.links.filter((_: any, i: number) => i !== index))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                             </div>
                         ))}
                         <Button variant="outline" className="w-full" onClick={() => handleContentChange('links', [...(currentContent.links || []), { platform: 'Twitter', url: '' }])}><PlusCircle className="mr-2 h-4 w-4" /> Add Link</Button>
                     </div>
                 )}
              </div>
              <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={saveChanges}>Save Changes</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}

    