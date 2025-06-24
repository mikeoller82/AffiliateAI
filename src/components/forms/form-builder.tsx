
'use client';
import { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { FieldLibrarySidebar } from './field-library';
import { FormCanvas } from './form-canvas';
import { SettingsPanel } from './settings-panel';
import { FormPreview } from './form-preview';
import type { FormField, FormSettings } from '@/lib/form-types';
import { Button } from '@/components/ui/button';
import { Eye, Settings, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormBuilderProps {
    initialFields: FormField[];
    initialSettings: FormSettings;
}

export function FormBuilder({ initialFields, initialSettings }: FormBuilderProps) {
    const [fields, setFields] = useState<FormField[]>(() => JSON.parse(JSON.stringify(initialFields)));
    const [selectedField, setSelectedField] = useState<FormField | null>(null);
    const [formSettings, setFormSettings] = useState<FormSettings>(initialSettings);

    const addField = (type: FormField['type']) => {
        const newField: FormField = {
            id: nanoid(),
            type,
            label: `New ${type} field`,
            placeholder: '',
            required: false,
        };

        if (type === 'checkbox') {
            newField.label = 'I agree to the terms and conditions';
        }

        setFields(prev => [...prev, newField]);
        setSelectedField(newField);
    };
    
    const updateField = (id: string, newProps: Partial<FormField>) => {
        setFields(prev => prev.map(f => (f.id === id ? { ...f, ...newProps } : f)));
        if (selectedField?.id === id) {
            setSelectedField(prev => prev ? { ...prev, ...newProps } : null);
        }
    };
    
    const deleteField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
        if (selectedField?.id === id) {
            setSelectedField(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground">
            {/* Left Sidebar: Fields Library */}
            <div className="w-64 border-r bg-card p-4">
                <FieldLibrarySidebar addField={addField} />
            </div>

            {/* Middle Panel: Canvas & Preview */}
            <main className="flex-1 flex flex-col items-center p-6 bg-muted/30 overflow-y-auto">
                 <div className="w-full max-w-3xl">
                     <Tabs defaultValue="edit" className="w-full">
                        <div className="flex justify-between items-center mb-4">
                            <TabsList>
                                <TabsTrigger value="edit"><Settings className="mr-2 h-4 w-4"/>Editor</TabsTrigger>
                                <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/>Preview</TabsTrigger>
                            </TabsList>
                             <Button><Save className="mr-2 h-4 w-4"/>Save Form</Button>
                        </div>
                        <TabsContent value="edit">
                            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                                <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                                    <FormCanvas
                                        fields={fields}
                                        selectedField={selectedField}
                                        onSelectField={setSelectedField}
                                        onDeleteField={deleteField}
                                    />
                                </SortableContext>
                            </DndContext>
                        </TabsContent>
                        <TabsContent value="preview">
                            <FormPreview fields={fields} settings={formSettings} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Right Sidebar: Settings Panel */}
            <aside className="w-80 border-l bg-card p-4 overflow-y-auto">
                <SettingsPanel 
                    selectedField={selectedField} 
                    onUpdateField={updateField} 
                    onClearSelection={() => setSelectedField(null)}
                    formSettings={formSettings}
                    onUpdateFormSettings={setFormSettings}
                />
            </aside>
        </div>
    );
}
