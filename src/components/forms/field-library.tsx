
'use client';
import { Button } from '@/components/ui/button';
import { Input, Pilcrow, AtSign, Phone, List, CheckSquare, Calendar, FileUp, Hash } from 'lucide-react';
import type { FormFieldType } from '@/lib/form-types';

interface FieldLibrarySidebarProps {
  addField: (type: FormFieldType) => void;
}

const fieldTypes: { type: FormFieldType, label: string, icon: React.ElementType }[] = [
    { type: 'text', label: 'Text Input', icon: Input },
    { type: 'textarea', label: 'Text Area', icon: Pilcrow },
    { type: 'email', label: 'Email', icon: AtSign },
    { type: 'phone', label: 'Phone', icon: Phone },
    { type: 'number', label: 'Number', icon: Hash },
    { type: 'select', label: 'Dropdown', icon: List },
    { type: 'radio', label: 'Radio Group', icon: List },
    { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { type: 'date', label: 'Date Picker', icon: Calendar },
    { type: 'file', label: 'File Upload', icon: FileUp },
];

export function FieldLibrarySidebar({ addField }: FieldLibrarySidebarProps) {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
            <div className="grid grid-cols-2 gap-2">
                {fieldTypes.map(field => (
                    <Button 
                        key={field.type} 
                        variant="outline"
                        className="flex flex-col h-20 items-center justify-center gap-1 text-center"
                        onClick={() => addField(field.type)}
                    >
                        <field.icon className="h-6 w-6" />
                        <span className="text-xs">{field.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
