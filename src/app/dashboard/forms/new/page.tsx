
'use client';

import { useSearchParams } from 'next/navigation';
import { FormBuilder } from '@/components/forms/form-builder';
import { getTemplateById } from '@/lib/form-templates';

export default function NewFormPage() {
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');
    const template = getTemplateById(templateId);

    return (
        <div className="w-full h-[calc(100vh-4rem)]">
            <FormBuilder
                key={template.id}
                initialFields={template.fields}
                initialSettings={template.settings}
            />
        </div>
    );
}
