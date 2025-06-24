
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormBuilder } from '@/components/forms/form-builder';
import { getTemplateById } from '@/lib/form-templates';

function NewFormCreator() {
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

export default function NewFormPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><p>Loading builder...</p></div>}>
            <NewFormCreator />
        </Suspense>
    );
}
