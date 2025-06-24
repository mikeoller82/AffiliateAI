
'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormField } from '@/lib/form-types';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (field: FormField) => void;
  onDelete: (id: string) => void;
}

function SortableField({ field, isSelected, onSelect, onDelete }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderField = () => {
    switch(field.type) {
      case 'textarea':
        return <Textarea placeholder={field.placeholder} disabled />;
      case 'email':
        return <Input type="email" placeholder={field.placeholder} disabled />;
      default:
        return <Input placeholder={field.placeholder} disabled />;
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group p-4 rounded-lg bg-card border transition-all cursor-pointer',
        isSelected ? 'border-primary shadow-glow-primary' : 'border-border'
      )}
      onClick={() => onSelect(field)}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2 pointer-events-none">
        <Label className="font-semibold">{field.label}{field.required && <span className="text-destructive"> *</span>}</Label>
        {renderField()}
      </div>
    </div>
  );
}


interface FormCanvasProps {
    fields: FormField[];
    selectedField: FormField | null;
    onSelectField: (field: FormField) => void;
    onDeleteField: (id: string) => void;
}

export function FormCanvas({ fields, selectedField, onSelectField, onDeleteField }: FormCanvasProps) {
  return (
    <div className="w-full bg-card border rounded-lg p-6 space-y-4 min-h-[300px]">
      {fields.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Add fields from the left sidebar to get started.</p>
        </div>
      ) : (
        fields.map(field => (
            <SortableField
                key={field.id}
                field={field}
                isSelected={selectedField?.id === field.id}
                onSelect={onSelectField}
                onDelete={onDeleteField}
            />
        ))
      )}
    </div>
  );
}
