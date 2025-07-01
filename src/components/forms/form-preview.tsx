
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { FormField, FormSettings } from '@/lib/form-types';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface FormPreviewProps {
  fields: FormField[];
  settings: FormSettings;
}

export function FormPreview({ fields, settings }: FormPreviewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: data,
          formName: settings.name,
          ownerId: settings.ownerId 
        }),
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }
      
      toast({
        title: "Success!",
        description: settings.successMessage,
      });

      if (settings.redirectUrl) {
          window.location.href = settings.redirectUrl;
      }
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
       toast({
        variant: 'destructive',
        title: "Submission Error",
        description: 'There was an error submitting the form.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = `preview-${field.id}`;
    const name = field.label.toLowerCase().replace(/\s+/g, '_');

    switch (field.type) {
      case 'textarea':
        return <Textarea id={fieldId} name={name} placeholder={field.placeholder} required={field.required} />;
      case 'email':
        return <Input type="email" id={fieldId} name={name} placeholder={field.placeholder} required={field.required} />;
      case 'phone':
        return <Input type="tel" id={fieldId} name={name} placeholder={field.placeholder} required={field.required} />;
      case 'number':
        return <Input type="number" id={fieldId} name={name} placeholder={field.placeholder} required={field.required} />;
      case 'date':
        return <Input type="date" id={fieldId} name={name} placeholder={field.placeholder} required={field.required} />;
      case 'file':
        return <Input type="file" id={fieldId} name={name} required={field.required} />;
      case 'checkbox':
        return (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id={fieldId} name={name} required={field.required} />
              <label htmlFor={fieldId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {field.label}
              </label>
            </div>
        )
      default:
        return <Input id={fieldId} name={name} placeholder={field.placeholder} required={field.required} />;
    }
  };

  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>{settings.name}</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                {fields.map(field => (
                    <div key={field.id} className="grid w-full items-center gap-1.5">
                        {field.type !== 'checkbox' && (
                            <Label htmlFor={`preview-${field.id}`}>
                                {field.label}
                                {field.required && <span className="text-destructive"> *</span>}
                            </Label>
                        )}
                        {renderField(field)}
                    </div>
                ))}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : settings.submitButtonText}
                </Button>
            </form>
        </CardContent>
    </Card>
  );
}
