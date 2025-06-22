
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Move, Trash2 } from 'lucide-react';

type ComponentType = 'hero' | 'features' | 'testimonials';

interface FunnelComponent {
  id: number;
  type: ComponentType;
  content: any;
}

// Placeholder components for the canvas
const HeroPreview = ({ content, styles }: { content: any, styles: any }) => (
  <div className="p-8 text-center rounded-lg" style={{ color: styles.textColor }}>
    <h2 className="text-4xl font-bold">{content.title}</h2>
    <p className="mt-2 text-lg">{content.subtitle}</p>
    <Button className="mt-4" style={{ backgroundColor: styles.primaryColor, color: styles.primaryColorForeground }}>{content.cta}</Button>
  </div>
);

const FeaturesPreview = ({ content, styles }: { content: any, styles: any }) => (
    <div className="p-8 rounded-lg text-center" style={{ color: styles.textColor }}>
        <h2 className="text-3xl font-bold">{content.title}</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
            {content.features.map((feat: any, i: number) => (
                <div key={i} className="p-6 bg-white/10 rounded-lg">
                    <h3 className="font-semibold text-xl">{feat.title}</h3>
                    <p className="text-sm mt-2">{feat.description}</p>
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
                <div key={i} className="p-6 bg-white/10 rounded-lg">
                    <blockquote className="italic">"{testimonial.quote}"</blockquote>
                    <p className="font-semibold mt-2">- {testimonial.author}</p>
                </div>
            ))}
        </div>
    </div>
);


const componentMap = {
  hero: HeroPreview,
  features: FeaturesPreview,
  testimonials: TestimonialsPreview,
};

const defaultContent = {
    hero: { title: 'Your Big Idea', subtitle: 'A catchy tagline to grab attention.', cta: 'Get Started Now' },
    features: {
        title: 'Amazing Features',
        features: [
            { title: 'Feature One', description: 'Description for feature one.' },
            { title: 'Feature Two', description: 'Description for feature two.' },
            { title: 'Feature Three', description: 'Description for feature three.' },
        ]
    },
    testimonials: {
        title: 'What Our Customers Say',
        testimonials: [
            { quote: 'This is the best product ever!', author: 'Happy Customer' },
            { quote: 'I can\'t believe how much it helped me.', author: 'Another Happy Customer' },
        ]
    }
}


export default function FunnelEditorPage({ params }: { params: { templateId: string } }) {
  const [components, setComponents] = useState<FunnelComponent[]>([
    { id: 1, type: 'hero', content: defaultContent.hero }
  ]);
  const [styles, setStyles] = useState({
    primaryColor: '#3B82F6',
    primaryColorForeground: '#FFFFFF',
    backgroundColor: '#111827',
    textColor: '#F9FAFB',
    font: 'Inter'
  });

  const addComponent = (type: ComponentType) => {
    const newComponent: FunnelComponent = {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
      {/* Sidebar */}
      <div className="lg:col-span-1 bg-card border-r overflow-y-auto">
        <Card className="rounded-none border-0 border-b sticky top-0 z-10">
          <CardHeader>
            <CardTitle>Funnel Editor</CardTitle>
          </CardHeader>
        </Card>
        <Tabs defaultValue="components" className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="styling">Styling</TabsTrigger>
          </TabsList>
          <TabsContent value="components" className="space-y-4 pt-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Add Sections</h3>
            <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('hero')}><PlusCircle className="mr-2" /> Hero Section</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('features')}><PlusCircle className="mr-2" /> Features</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => addComponent('testimonials')}><PlusCircle className="mr-2" /> Testimonials</Button>
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Canvas */}
      <div className="lg:col-span-3 bg-muted/30 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-lg shadow-lg space-y-6"
            style={{ backgroundColor: styles.backgroundColor, fontFamily: styles.font }}
          >
            {components.map(component => {
                const ComponentPreview = componentMap[component.type];
                return (
                    <div key={component.id} className="relative group border-2 border-transparent hover:border-primary hover:border-dashed">
                         <div className="absolute -top-3 right-2 z-10 hidden group-hover:flex items-center gap-1 bg-primary p-1 rounded-md shadow text-primary-foreground">
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
  );
}
